import { copyFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join, dirname } from 'path';

async function copyToRelease() {
  const filesToCopy = ['package.json', 'README.md'];
  const targetDir = 'release';
  
  console.log('开始复制文件到 release 文件夹...');
  
  // 确保 release 文件夹存在
  if (!existsSync(targetDir)) {
    await mkdir(targetDir, { recursive: true });
    console.log(`创建目录: ${targetDir}`);
  }
  
  // 复制每个文件
  for (const file of filesToCopy) {
    const sourcePath = file; // 根目录下的文件
    const targetPath = join(targetDir, file);
    
    try {
      await copyFile(sourcePath, targetPath);
      console.log(`✅ 已复制: ${sourcePath} → ${targetPath}`);
    } catch (error) {
      console.error(`❌ 复制失败 ${sourcePath}:`, error.message);
    }
  }
  
  console.log('文件复制完成！');
}

// 执行复制
copyToRelease().catch(console.error);