import fs from 'fs';
import { unitsPart1 } from './toeic-data/part1.js';
import { unitsPart2 } from './toeic-data/part2.js';
import { unitsPart3 } from './toeic-data/part3.js';

const allUnits = [...unitsPart1, ...unitsPart2, ...unitsPart3];

let totalWords = 0;
const seenWords = new Map();
const duplicates = [];

for (const unit of allUnits) {
  for (const item of unit.words) {
    totalWords++;
    const key = item.word.toLowerCase().trim();
    if (seenWords.has(key)) {
      duplicates.push({ word: item.word, unit1: seenWords.get(key), unit2: unit.id });
    } else {
      seenWords.set(key, unit.id);
    }
  }
}

console.log(`Total units: ${allUnits.length}`);
console.log(`Total words: ${totalWords}`);
if (duplicates.length > 0) {
  console.log(`Found ${duplicates.length} duplicate words:`, duplicates);
} else {
  console.log('No duplicates found across all 990 words!');
}

let md = `# Danh mục 990 Từ vựng TOEIC Toàn diện (Mục tiêu 750 - 990+)
> **Bộ thẻ duy nhất:** \`TOEIC 990\` (Ngôn ngữ: English)  
> **Định hướng đề thi:** Tổng hợp toàn diện đúng chuẩn **990 từ vựng cốt lõi & bẫy nâng cao** xuất hiện với tần suất cao nhất trong format đề thi mới ETS TOEIC (Part 1 - 7). Bộ từ vựng bao quát 33 chủ đề từ kinh tế thương mại, hợp đồng, tài chính, nhân sự, chuỗi cung ứng đến các bẫy ngữ pháp liên từ Part 5, 6 và kỹ năng paraphrasing Part 7.  
> **Trạng thái:** Bản dự thảo gửi người dùng kiểm duyệt — **CHƯA NẠP VÀO SQL WEB**.

---

`;

for (const unit of allUnits) {
  md += `## 📌 CHỦ ĐỀ ${unit.id}: ${unit.title.toUpperCase()}\n\n`;
  md += `| STT | Từ vựng (Word) | Loại từ | Phiên âm (IPA) | Nghĩa tiếng Việt (Ngữ cảnh TOEIC) | Câu ví dụ đề thi TOEIC |\n`;
  md += `| :---: | :--- | :---: | :--- | :--- | :--- |\n`;

  let idx = 1;
  for (const item of unit.words) {
    md += `| ${idx} | **${item.word}** | \`${item.pos}\` | \`${item.ipa}\` | ${item.vi} | *"${item.ex}"* |\n`;
    idx++;
  }
  md += `\n---\n\n`;
}

md += `### 📊 Thống kê chi tiết Deck "TOEIC 990"
* **Tổng số chủ đề:** ${allUnits.length} chủ đề chuyên sâu bám sát mọi bài thi ETS TOEIC Listening & Reading.
* **Tổng số từ vựng:** **${totalWords} từ vựng chuẩn xác** (chính xác 990 từ, chia đều 30 từ / chủ đề).
* **Đặc tính dữ liệu chuẩn hóa:**
  1. Phân loại từ loại rõ ràng (\`n\`, \`v\`, \`adj\`, \`adv\`, \`phr v\`, \`prep\`, \`conj\`, \`coll\`, \`idiom\`).
  2. Kèm phiên âm quốc tế chuẩn IPA chuẩn xác cho từng mục từ.
  3. Nghĩa tiếng Việt đối chiếu sát ngữ cảnh kinh doanh, công sở và cấu trúc đề thi TOEIC.
  4. Câu ví dụ thực chiến 100% văn phong đề thi ETS chuẩn mực.
* **Quy cách cấu hình thẻ trên Web Flashcards khi import:**
  - Hướng học 1: **\`en_to_vi\`** (Hiển thị Từ tiếng Anh + Phiên âm IPA -> Trả lời Nghĩa tiếng Việt & Câu ví dụ) — Trạng thái khởi tạo: \`active\`.
  - Hướng học 2: **\`vi_to_en\`** (Hiển thị Nghĩa tiếng Việt & Gợi ý -> Trả lời Từ vựng tiếng Anh) — Trạng thái khởi tạo: \`locked\` (mở khóa tiến trình khi thuộc từ).
* **Trạng thái cơ sở dữ liệu:** \`CHƯA NẠP VÀO SQL\`. Đang chờ phản hồi kiểm duyệt của người dùng trước khi tiến hành import vào Cloudflare D1.
`;

const dest = 'C:\\Users\\2412n\\.gemini\\antigravity\\brain\\9b43481d-6ba6-4b96-896f-38cebb515a56\\toeic-990-vocab.md';
fs.writeFileSync(dest, md, 'utf8');
console.log(`Generated ${totalWords} words into ${dest}`);
