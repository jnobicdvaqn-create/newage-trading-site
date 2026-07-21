#!/usr/bin/env python3
"""
CIF 报价计算器 v2.0
支持多国家、多车型、实时汇率（需手动更新）
输出: Markdown 报价表 + JSON 数据

用法:
    python3 tools/cif-calculator.py --country ghana --output quote.md
    python3 tools/cif-calculator.py --country georgia --output quote.md --format json
"""

import argparse
import json
from datetime import datetime

# ========== 配置区（需定期更新） ==========

EXCHANGE_RATES = {
    "USD_CNY": 7.25,
    "USD_GHS": 15.50,
    "USD_GEL": 2.70,  # 格鲁吉亚拉里
    "USD_NGN": 1550,  # 尼日利亚奈拉
    "USD_KES": 130,   # 肯尼亚先令
    "USD_XOF": 605,   # 西非法郎
}

SHIPPING_COSTS = {
    "ghana": {
        "roro_per_car": 650,
        "20ft_container": 2800,
        "40ft_container": 4200,
        "transit_days": "25-30",
        "port": "Tema",
    },
    "georgia": {
        "roro_per_car": 800,
        "20ft_container": 3500,
        "40ft_container": 5000,
        "transit_days": "30-35",
        "port": "Poti",
    },
    "nigeria": {
        "roro_per_car": 700,
        "20ft_container": 3000,
        "40ft_container": 4500,
        "transit_days": "30-40",
        "port": "Lagos",
    },
}

TAXES = {
    "ghana": {
        "import_duty": 0.20,
        "vat": 0.175,
        "ecowas_levy": 0.005,
        "nli_levy": 0.01,
        "processing_fee": 250,
    },
    "georgia": {
        "import_duty": 0.05,
        "vat": 0.18,
        "excise_by_cc": True,  # 按排量征收
        "processing_fee": 150,
    },
}

# ========== 车型数据库 ==========

CARS = [
    {"model": "BYD Seagull", "fob_usd": 9500, "type": "EV", "cc": 0},
    {"model": "BYD Atto 3", "fob_usd": 28000, "type": "EV", "cc": 0},
    {"model": "BYD Dolphin", "fob_usd": 15000, "type": "EV", "cc": 0},
    {"model": "Geely Monjaro", "fob_usd": 22000, "type": "ICE", "cc": 2000},
    {"model": "Chery Omoda 5", "fob_usd": 18000, "type": "ICE", "cc": 1600},
    {"model": "Great Wall Haval H6", "fob_usd": 24000, "type": "ICE", "cc": 2000},
    {"model": "MG4 EV", "fob_usd": 20000, "type": "EV", "cc": 0},
    {"model": "Nissan Sunny (Used)", "fob_usd": 5000, "type": "Used", "cc": 1500},
    {"model": "Toyota Corolla (Used)", "fob_usd": 6500, "type": "Used", "cc": 1800},
]


def calculate_cif(fob_usd, country="ghana", shipping_method="roro", cars_per_container=4):
    """计算 CIF 价格"""
    shipping = SHIPPING_COSTS.get(country, {})
    
    if shipping_method == "roro":
        shipping_per_car = shipping.get("roro_per_car", 650)
    else:
        shipping_per_car = shipping.get("40ft_container", 4200) / cars_per_container
    
    insurance = fob_usd * 0.002
    cif = fob_usd + shipping_per_car + insurance
    
    return cif, shipping_per_car, insurance


def calculate_taxes(cif_usd, country="ghana"):
    """计算进口税费"""
    taxes = TAXES.get(country, {})
    total = 0
    
    if "import_duty" in taxes:
        duty = cif_usd * taxes["import_duty"]
        total += duty
        vat_base = cif_usd + duty
    else:
        vat_base = cif_usd
    
    if "vat" in taxes:
        vat = vat_base * taxes["vat"]
        total += vat
    
    if "ecowas_levy" in taxes:
        total += cif_usd * taxes["ecowas_levy"]
    
    if "nli_levy" in taxes:
        total += cif_usd * taxes["nli_levy"]
    
    total += taxes.get("processing_fee", 0)
    
    return total


def generate_quote(country="ghana", markup=0.12, output_format="markdown"):
    """生成报价表"""
    results = []
    
    for car in CARS:
        cif, shipping, insurance = calculate_cif(car["fob_usd"], country)
        taxes = calculate_taxes(cif, country)
        landed = cif + taxes
        selling_price = cif * (1 + markup)
        profit = selling_price - cif
        
        results.append({
            "model": car["model"],
            "type": car["type"],
            "fob_usd": car["fob_usd"],
            "shipping": shipping,
            "insurance": insurance,
            "cif_usd": cif,
            "taxes": taxes,
            "landed_cost": landed,
            "selling_price": selling_price,
            "profit": profit,
            "margin": markup * 100,
        })
    
    return results


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="CIF 报价计算器")
    parser.add_argument("--country", default="ghana", help="目标国家")
    parser.add_argument("--markup", type=float, default=0.12, help="利润率")
    parser.add_argument("--output", help="输出文件路径")
    parser.add_argument("--format", default="markdown", choices=["markdown", "json"])
    args = parser.parse_args()
    
    results = generate_quote(args.country, args.markup, args.format)
    
    if args.format == "json":
        output = json.dumps(results, indent=2, ensure_ascii=False)
    else:
        output = "# CIF 报价表\n\n"
        output += f"**国家：** {args.country}\n"
        output += f"**日期：** {datetime.now().strftime('%Y-%m-%d')}\n"
        output += f"**利润率：** {args.markup*100}%\n\n"
        
        output += "| 车型 | FOB(USD) | CIF(USD) | 税费(USD) | 到岸价(USD) | 建议售价(USD) |\n"
        output += "|------|---------|---------|----------|-----------|-------------|\n"
        
        for r in results:
            output += f"| {r['model']} | {r['fob_usd']:,.0f} | {r['cif_usd']:,.0f} | {r['taxes']:,.0f} | {r['landed_cost']:,.0f} | {r['selling_price']:,.0f} |\n"
    
    if args.output:
        with open(args.output, 'w') as f:
            f.write(output)
        print(f"✅ 报价表已输出: {args.output}")
    else:
        print(output)
