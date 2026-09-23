---
workflow: general-video
flow: companion
storyboard: no
message: "So sánh Dev vs DevOps — góc 'Dev xây, DevOps vận hành' cho series 'so sánh/phân biệt kiến thức'"
destination: tiktok
aspect: 1080x1920
language: vi
length: 30-40s
---

## Intent

Video so sánh trong series "so sánh/phân biệt kiến thức" (xem `../../DESIGN.md` cho hợp đồng
layout/màu/font/motion 3-zone dùng chung — **không lặp lại ở đây**, chỉ đổi nội dung).

Cặp khái niệm: **Dev vs DevOps**. Góc so sánh: Dev là người viết code / xây tính năng; DevOps
là người đưa code đó lên môi trường thực tế, tự động hoá và giám sát — "Dev xây, DevOps vận
hành".

## Assets

- Icon 2 card: vẽ CSS/SVG placeholder (không phụ thuộc ảnh ngoài) — trái = cửa sổ terminal với
  glyph `</>` (đại diện Dev/viết code), phải = vòng lặp vô cực SVG (đại diện DevOps/CI-CD liên
  tục).
- Giọng đọc: Edge TTS (`vi-VN-NamMinhNeural`, speed 1.1x), sinh qua `scripts/generate-vo.mjs`
  (đọc từ `.env` ở **repo root**, dùng chung với video khác trong series). 12 clip mp3 tại
  `assets/vo/line-N.mp3`, thời lượng thật ghi ở `assets/vo/durations.json`. Nhịp caption/pose/emphasis
  trong `index.html` bám theo các mốc `[start, start+duration]` thật của từng clip.

## Customizations

Không có tuỳ biến khác biệt với template — kế thừa nguyên vẹn từ `DESIGN.md`.

## Notes

- Kịch bản 12 dòng chuẩn:
  - Beat 1: Hook (Dev / DevOps)
  - Beat 2: Nút thắt (Sự khác nhau là gì?)
  - Beat 3: Giải Dev (viết code tính năng, biến ý tưởng thành sản phẩm, ví dụ kiến trúc sư)
  - Beat 4: Giải DevOps (đưa lên server tự động hóa, giám sát không sập, ví dụ ban quản lý)
  - Beat 5: So sánh trực tiếp (tạo ra sản phẩm vs giữ nó sống giữa hàng triệu người dùng)
  - Beat 6: Payoff (Dev xây, DevOps vận hành — giữ khung hình tới hết).
