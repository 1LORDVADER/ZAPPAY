# New White-Background Product Images - CDN URLs

All images generated with transparent/white backgrounds for premium e-commerce presentation.

## CDN URLs (Permanent)

1. **Thin Mint GSC**: https://files.manuscdn.com/user_upload_by_module/session_file/310419663028620876/TTXvfRiNQrnZOQrI.png
2. **Ice Cream Cake**: https://files.manuscdn.com/user_upload_by_module/session_file/310419663028620876/xbKjsgGgGgGayWsm.png
3. **OG Kush**: https://files.manuscdn.com/user_upload_by_module/session_file/310419663028620876/PIFMvZYMiUaLOWMa.png
4. **Purple Haze**: https://files.manuscdn.com/user_upload_by_module/session_file/310419663028620876/zeprWLHaXisWyteC.png
5. **Sour Diesel**: https://files.manuscdn.com/user_upload_by_module/session_file/310419663028620876/imgnbJwoKExqbMZx.png

## Database Update SQL

```sql
-- Update Thin Mint GSC (product ID 90024)
UPDATE products SET photos = 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663028620876/TTXvfRiNQrnZOQrI.png' WHERE id = 90024;

-- Update Ice Cream Cake
UPDATE products SET photos = 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663028620876/xbKjsgGgGgGayWsm.png' WHERE name LIKE '%Ice Cream Cake%';

-- Update OG Kush  
UPDATE products SET photos = 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663028620876/PIFMvZYMiUaLOWMa.png' WHERE name LIKE '%OG Kush%';

-- Update Purple Haze
UPDATE products SET photos = 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663028620876/zeprWLHaXisWyteC.png' WHERE name LIKE '%Purple Haze%';

-- Update Sour Diesel
UPDATE products SET photos = 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663028620876/imgnbJwoKExqbMZx.png' WHERE name LIKE '%Sour Diesel%';
```
