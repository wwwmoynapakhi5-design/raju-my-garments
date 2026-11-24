# রাজু হোসাইনের My Garments হিসাব (PWA)

## কী আছে
- Buyer, Style, Color, Season, Group এবং Order Quantity
- Daily Input, Daily Assembly, Daily Output
- অর্ডারভিত্তিক স্বয়ংক্রিয় Total Counting
- অফলাইন ব্যবহারের জন্য service worker cache
- JSON backup restore এবং CSV export
- অর্ডার ও দৈনিক এন্ট্রি edit/delete

## ফ্রি প্রকাশ (GitHub Pages)
1. GitHub-এ বিনামূল্যে account খুলুন।
2. নতুন public repository তৈরি করুন, যেমন `my-garments`.
3. ZIP ফাইলটি extract করে এর ভেতরের সব ফাইল repository-তে upload করুন।
4. Repository > Settings > Pages খুলুন।
5. Deploy from a branch নির্বাচন করুন; Branch `main`, folder `/ (root)` দিয়ে Save করুন।
6. কিছুক্ষণ পর GitHub একটি `https://আপনার-ইউজারনেম.github.io/my-garments/` লিংক দেবে।
7. Android Chrome-এ লিংক খুলে menu > Add to Home screen / Install app চাপুন।

## অফলাইন ও ডেটা
- প্রথমবার অ্যাপটি ইন্টারনেট থাকা অবস্থায় খুলুন, যাতে offline cache তৈরি হয়।
- এন্ট্রিগুলো এই ব্রাউজারের localStorage-এ থাকে। অ্যাপ uninstall, browser data clear বা ফোন বদলালে ডেটা হারাতে পারে।
- তাই Backup tab থেকে নিয়মিত JSON backup ডাউনলোড করুন। অন্য ফোনে একই অ্যাপ খুলে JSON backup import করুন।
- এই সংস্করণে cloud sync নেই; শুধু এই ডিভাইসের local data।
- Play Store-এ প্রকাশ আলাদা প্রক্রিয়া এবং ডেভেলপার ফি প্রযোজ্য হতে পারে।

এটি প্রাথমিক কার্যকর সংস্করণ। গুরুত্বপূর্ণ অফিসিয়াল হিসাব ব্যবহারের আগে কয়েকদিন নমুনা ডেটা দিয়ে পরীক্ষা করুন।
