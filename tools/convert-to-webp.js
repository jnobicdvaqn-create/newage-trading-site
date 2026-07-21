#!/usr/bin/env node
/**
 * WebP 批量转换脚本
 * 
 * 用法: node tools/convert-to-webp.js [--dry-run] [--quality 75]
 * 
 * 功能:
 * - 将 public/images/ 下所有 JPEG/JPG 转换为 WebP
 * - 保留原始文件（手动删除）
 * - 输出转换统计信息
 */

import sharp from 'sharp';
import { readdirSync, statSync, existsSync, mkdirSync } from 'fs';
import { join, dirname, extname, basename } from 'path';

const IMAGES_DIR = join(process.cwd(), 'public/images');
const DRY_RUN = process.argv.includes('--dry-run');
const QUALITY = parseInt(process.argv.find(a => a.startsWith('--quality='))?.split('=')[1] || '75', 10);

let totalFiles = 0;
let totalOriginal = 0;
let totalWebp = 0;
let errors = [];

async function convertDirectory(dir) {
    const entries = readdirSync(dir);
    
    for (const entry of entries) {
        const fullPath = join(dir, entry);
        const stat = statSync(fullPath);
        
        if (stat.isDirectory()) {
            await convertDirectory(fullPath);
            continue;
        }
        
        const ext = extname(entry).toLowerCase();
        if (ext !== '.jpg' && ext !== '.jpeg') continue;
        
        totalFiles++;
        const originalSize = stat.size;
        totalOriginal += originalSize;
        
        const webpPath = fullPath.replace(/\.(jpg|jpeg)$/i, '.webp');
        const relPath = fullPath.replace(process.cwd() + '/', '');
        
        if (DRY_RUN) {
            console.log(`[DRY RUN] ${relPath} (${(originalSize / 1024).toFixed(0)} KB → ? KB)`);
            continue;
        }
        
        try {
            await sharp(fullPath)
                .webp({ quality: QUALITY, effort: 6 })
                .toFile(webpPath);
            
            const webpSize = statSync(webpPath).size;
            const savings = ((1 - webpSize / originalSize) * 100).toFixed(1);
            totalWebp += webpSize;
            
            console.log(`✅ ${relPath}`);
            console.log(`   ${(originalSize / 1024).toFixed(0)} KB → ${(webpSize / 1024).toFixed(0)} KB (省 ${savings}%)`);
        } catch (err) {
            errors.push({ file: relPath, error: err.message });
            console.log(`❌ ${relPath}: ${err.message}`);
        }
    }
}

console.log(`WebP 转换工具 - ${DRY_RUN ? 'DRY RUN' : '实际转换'}`);
console.log(`质量: ${QUALITY}, 目录: ${IMAGES_DIR}`);
console.log('='.repeat(60));

await convertDirectory(IMAGES_DIR);

console.log('\n' + '='.repeat(60));
console.log(`总计: ${totalFiles} 个文件`);
console.log(`原始大小: ${(totalOriginal / 1024 / 1024).toFixed(2)} MB`);

if (!DRY_RUN) {
    console.log(`WebP 大小: ${(totalWebp / 1024 / 1024).toFixed(2)} MB`);
    console.log(`节省: ${((1 - totalWebp / totalOriginal) * 100).toFixed(1)}% (${((totalOriginal - totalWebp) / 1024 / 1024).toFixed(2)} MB)`);
}

if (errors.length > 0) {
    console.log(`\n错误 (${errors.length}):`);
    errors.forEach(e => console.log(`  ${e.file}: ${e.error}`));
}
