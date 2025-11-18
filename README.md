# AI Server Manager (Node.js)

> محتوى المشروع: بوت Discord متكامل مع Dashboard، تذاكر، نظام حماية ذكي، أوامر سلاش، إدارة غرف صوتية مؤقتة، وذكاء GPT.

## خطوات التشغيل (Replit / iSH / Termux)
1. ضع مفاتيحك في `config.json`:
   - token: توكن البوت (Discord Developer Portal)
   - openai_key: مفتاح OpenAI
   - owner_id: ايديك
2. ثبّت الحزم:
   ```
   npm install
   ```
3. شغّل البوت:
   ```
   node index.js
   ```
4. افتح لوحة التحكم:
   - `http://localhost:3000`  او Replit يعطيك URL عام.

## ملاحظات مهمة
- فعل Intents التالية في Discord Developer Portal:
  - Message Content Intent
  - Server Members Intent
- لو تبغى حفظ دائم للـ logs/warnings/tickets استخدم قاعدة بيانات (مثل Replit DB أو MongoDB).
- لتسجيل أوامر السلاش للبوت في سيرفرات متعددة قد تحتاج تسجيل لكل تطبيق/سيرفر.

## دعم
إذا تبي أجهّز لك المشروع مصنع ZIP جاهز للرفع، أو أرفع الريبو على GitHub، أرسِل "سوي ZIP" أو "ارفع على GitHub".
