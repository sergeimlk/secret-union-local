/**
 * generate-content-map.js
 * Scans the P-E Skool content directories and generates a structured
 * content-map.json used by the React app to render modules and lessons.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTENT_ROOT = path.resolve(__dirname, '../../');
const OUTPUT_PATH = path.resolve(__dirname, '../public/content/content-map.json');

// Module directory names (in order as they appear on Skool)
const MODULE_DIRS = [
  '00 - TON POINT DE DÉPART',
  '01 - LES FONDATIONS - LEVEL 1',
  '02 - BILAN HEBDOMADAIRE',
  '03 - CLASSIC & BODY - LEVEL 2',
  '04 - THE CLASSIC CLASS - LEVEL 3',
  '05 - MEN’S PHYSIQUE - LEVEL 2',
  '06 - COMPÉTITION - LEVEL 4',
  '07 - MOBILITÉ & ACTIVATION',
  '08 - VACUUM',
  '09 - CORRECTIONS QUOTIDIENNES',
  '10 - RESSOURCES EXCLUSIVES',
  '11 - ACCOMPAGNEMENT 1:1',
];

// Module metadata from scraped data
const MODULE_META = {
  '00': { description: 'Commence ici pour bien comprendre le fonctionnement du Skool !' },
  '01': { description: 'Ici, tu retrouveras les bases théoriques du posing pour comprendre ce Skool !', level: 1 },
  '02': { description: 'Chaque semaine, remplis ton bilan pour recevoir ton plan d\'action de la semaine !' },
  '03': { description: 'Ce module est dédié aux athlètes en catégorie Classic Physique et Bodybuilding !', level: 2 },
  '04': { description: 'Le module ultime pour faire de toi le best poseur et avoir une routine de l\'enfer !', level: 3 },
  '05': { description: 'Dans ce module dédié aux Men\'s Physique, nous verrons : poses, transitions, I-Walk…', level: 2 },
  '06': { description: 'Ce module va faire de toi un athlète du top 1% !', level: 4 },
  '07': { description: 'Exercices de mobilité, d\'étirements et de massages pour résoudre tes blocages !' },
  '08': { description: 'Grâce à ce module, tu auras le vacuum à CBum !' },
  '09': { description: 'Je corrige 3 de vos poses quotidiennement !' },
  '10': { description: 'Rediffusion live, séminaires, intervenants VIP, documents de posing…' },
  '11': { description: 'Module exclusivement dédié aux membres de mon accompagnement 1:1 💎' },
};

// Load scraped lesson data for hasVideo info
let scrapedData = [];
try {
  const scrapedPath = path.resolve(CONTENT_ROOT, '_scraped_lessons_data.json');
  scrapedData = JSON.parse(fs.readFileSync(scrapedPath, 'utf-8'));
} catch {
  console.warn('⚠️  _scraped_lessons_data.json not found, video detection will use filesystem.');
}

function slugify(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function extractNumber(dirName) {
  const match = dirName.match(/^(\d+)\s*-\s*/);
  return match ? match[1] : null;
}

function extractTitle(dirName) {
  return dirName.replace(/^\d+\s*-\s*/, '').trim();
}

function getModuleTitle(dirName) {
  // Remove the number prefix
  return dirName.replace(/^\d+\s*-\s*/, '').trim();
}

function scanLessonDir(lessonPath) {
  if (!fs.existsSync(lessonPath)) return null;
  
  const files = fs.readdirSync(lessonPath);
  const result = {
    hasVideo: false,
    videoFile: null,
    textFile: null,
    contentFile: null,
    isRemoteVideo: false,
  };

  // Check for video_url.txt first for remote video
  const urlFile = files.find(f => f.toLowerCase() === 'video_url.txt');
  if (urlFile) {
    try {
      const content = fs.readFileSync(path.join(lessonPath, urlFile), 'utf-8');
      const match = content.match(/M3U8 Stream URL:\s*(https?:\/\/\S+)/i);
      if (match) {
        result.hasVideo = true;
        result.videoFile = match[1];
        result.isRemoteVideo = true;
      }
    } catch (err) {
      console.error(`Error reading video_url.txt in ${lessonPath}:`, err);
    }
  }

  for (const file of files) {
    const lower = file.toLowerCase();
    
    // If we didn't find a remote video, check for local video as fallback
    if (!result.hasVideo && (lower.endsWith('.mp4') || lower.endsWith('.webm') || lower.endsWith('.mov'))) {
      result.hasVideo = true;
      result.videoFile = file;
      result.isRemoteVideo = false;
    }
    
    if (lower === 'content.md') {
      result.contentFile = file;
    }
    if (lower.endsWith('.txt') && lower !== 'video_url.txt') {
      result.textFile = file;
    }
  }

  return result;
}

function buildContentMap() {
  const modules = [];

  for (const moduleDir of MODULE_DIRS) {
    const modulePath = path.join(CONTENT_ROOT, moduleDir);
    if (!fs.existsSync(modulePath)) {
      console.warn(`⚠️  Module dir not found: ${moduleDir}`);
      continue;
    }

    const moduleNumber = extractNumber(moduleDir);
    const moduleTitle = getModuleTitle(moduleDir);
    const meta = MODULE_META[moduleNumber] || {};
    const moduleId = slugify(`${moduleNumber}-${moduleTitle}`);

    // Check for Description.txt
    let description = meta.description || '';
    const descPath = path.join(modulePath, 'Description.txt');
    if (fs.existsSync(descPath) && !description) {
      description = fs.readFileSync(descPath, 'utf-8').trim().split('\n').slice(1).join(' ').trim();
    }

    // Cover image
    const coverInModule = fs.existsSync(path.join(modulePath, 'cover.jpg'));
    const coverInCovers = fs.existsSync(path.join(CONTENT_ROOT, 'covers', `${moduleNumber}_${moduleTitle}.jpg`));
    
    let coverImage = null;
    if (coverInModule) {
      coverImage = `/content/${moduleDir}/cover.jpg`;
    } else if (coverInCovers) {
      coverImage = `/content/covers/${moduleNumber}_${moduleTitle}.jpg`;
    }

    // Find scraped module data for hasVideo info
    const scrapedModule = scrapedData.find(m => m.index === parseInt(moduleNumber));

    // Scan lesson directories — prefer the emoji-named dirs from scraped data
    const lessons = [];
    const allEntries = fs.readdirSync(modulePath, { withFileTypes: true });
    const lessonDirs = allEntries
      .filter(e => e.isDirectory() && /^\d+\s*-\s*/.test(e.name))
      .sort((a, b) => {
        const numA = parseInt(extractNumber(a.name));
        const numB = parseInt(extractNumber(b.name));
        return numA - numB;
      });

    // Group lesson dirs by number — prefer the one from scraped data (emoji named)
    const lessonsByNumber = new Map();
    for (const dir of lessonDirs) {
      const num = extractNumber(dir.name);
      if (!lessonsByNumber.has(num)) {
        lessonsByNumber.set(num, []);
      }
      lessonsByNumber.get(num).push(dir.name);
    }

    for (const [lessonNum, dirNames] of lessonsByNumber) {
      // If we have scraped data, prefer the dir that matches scraped title
      let chosenDir = dirNames[0];
      let scrapedLesson = null;

      if (scrapedModule && scrapedModule.lessons) {
        scrapedLesson = scrapedModule.lessons.find(l => {
          return dirNames.some(d => d === l.dir);
        });
        if (scrapedLesson) {
          chosenDir = scrapedLesson.dir;
        }
      }

      // If multiple dirs for same number, prefer the one with content
      if (dirNames.length > 1 && !scrapedLesson) {
        for (const d of dirNames) {
          const scan = scanLessonDir(path.join(modulePath, d));
          if (scan && (scan.hasVideo || scan.contentFile)) {
            chosenDir = d;
            break;
          }
        }
      }

      const lessonPath = path.join(modulePath, chosenDir);
      const scan = scanLessonDir(lessonPath);
      if (!scan) continue;

      const lessonTitle = extractTitle(chosenDir);
      const lessonId = slugify(`${lessonNum}-${lessonTitle}`);

      // Determine hasVideo from scraped data or filesystem
      const hasVideo = scrapedLesson ? scrapedLesson.hasVideo : scan.hasVideo;

      const contentPath = `/content/${moduleDir}/${chosenDir}`;

      const lesson = {
        id: lessonId,
        number: lessonNum,
        title: lessonTitle,
        type: hasVideo ? 'video' : 'text',
        hasVideo,
        contentFile: scan.contentFile ? `${contentPath}/${scan.contentFile}` : null,
        videoFile: scan.videoFile ? (scan.isRemoteVideo ? scan.videoFile : `${contentPath}/${scan.videoFile}`) : null,
        textFile: scan.textFile ? `${contentPath}/${scan.textFile}` : null,
        dir: chosenDir,
      };

      lessons.push(lesson);
    }

    const moduleData = {
      id: moduleId,
      number: moduleNumber,
      title: moduleTitle,
      description,
      level: meta.level || null,
      coverImage,
      totalLessons: lessons.length,
      lessons,
    };

    modules.push(moduleData);
  }

  return { modules };
}

// Run
console.log('🔍 Scanning content directories...');
const contentMap = buildContentMap();
console.log(`✅ Found ${contentMap.modules.length} modules`);
contentMap.modules.forEach(m => {
  console.log(`   📁 ${m.number} - ${m.title} (${m.lessons.length} lessons)`);
});

fs.writeFileSync(OUTPUT_PATH, JSON.stringify(contentMap, null, 2), 'utf-8');
console.log(`\n📄 content-map.json written to ${OUTPUT_PATH}`);
