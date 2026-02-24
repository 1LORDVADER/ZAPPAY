-- Comprehensive Product Descriptions for ZAPPAY Cannabis Platform
-- These descriptions provide detailed information about each strain's effects, flavors, and characteristics

-- Girl Scout Cookies (Thin Mint GSC)
UPDATE products SET 
  description = 'Girl Scout Cookies, also known as GSC or Thin Mint GSC, is a legendary hybrid strain that has taken the cannabis world by storm. This award-winning cultivar delivers a powerful euphoric high combined with full-body relaxation. Users report feeling happy, uplifted, and creative, making it perfect for both recreational and medicinal use. The flavor profile features sweet and earthy notes with hints of mint and chocolate, reminiscent of its namesake cookie. GSC is particularly effective for managing stress, chronic pain, and appetite loss. With its balanced hybrid genetics, this strain offers the best of both indica and sativa effects, providing mental clarity alongside physical comfort. The dense, frosty buds showcase vibrant purple hues and a thick coating of trichomes, indicating exceptional quality and potency.'
WHERE name LIKE '%Girl Scout%' OR name LIKE '%GSC%' OR name LIKE '%Thin Mint%';

-- Blue Dream
UPDATE products SET
  description = 'Blue Dream is a sativa-dominant hybrid that has become one of the most popular strains in North America. This California-born cultivar combines the best qualities of Blueberry indica and Haze sativa, resulting in a balanced high that soothes the body while invigorating the mind. Users experience gentle cerebral stimulation paired with full-body relaxation, making it ideal for daytime use. The flavor profile bursts with sweet berry notes complemented by herbal undertones. Blue Dream is highly regarded for its therapeutic benefits, effectively treating depression, chronic pain, and nausea without overwhelming sedation. The strain produces large, resinous buds with a beautiful blue-green coloration and orange pistils. Its moderate THC content makes it accessible to both novice and experienced consumers seeking a reliable, well-rounded cannabis experience.'
WHERE name LIKE '%Blue Dream%';

-- OG Kush
UPDATE products SET
  description = 'OG Kush stands as one of the most iconic and influential cannabis strains in history. This legendary hybrid, with its mysterious genetic origins, delivers a complex high that begins with a euphoric head rush before settling into deep physical relaxation. The strain is renowned for its distinctive flavor profile featuring earthy pine, woody notes, and a subtle fuel-like aroma that has become synonymous with premium cannabis. OG Kush is particularly effective for managing stress, anxiety, and chronic pain, making it a favorite among medical patients. The dense, sticky buds are covered in a thick layer of crystalline trichomes, showcasing exceptional resin production. This strain has served as the genetic foundation for countless modern hybrids and remains a top choice for consumers seeking potent, reliable effects. Evening use is recommended due to its strong relaxing properties.'
WHERE name LIKE '%OG Kush%';

-- Purple Haze
UPDATE products SET
  description = 'Purple Haze is a legendary sativa-dominant strain that rose to fame in the 1960s, immortalized by Jimi Hendrix. This psychedelic cultivar delivers an energetic, creative high that promotes focus and euphoria. Users report enhanced sensory perception, making it popular among artists and creative professionals. The flavor profile combines sweet berry notes with earthy undertones and a hint of spice. Purple Haze showcases stunning visual appeal with deep purple hues throughout the buds, complemented by bright orange pistils and a generous coating of trichomes. This strain is particularly effective for combating fatigue, depression, and lack of appetite. The uplifting effects make it ideal for daytime use, social gatherings, or creative projects. Purple Haze represents classic cannabis genetics that continue to captivate consumers with its potent cerebral effects and distinctive appearance.'
WHERE name LIKE '%Purple Haze%';

-- Sour Diesel
UPDATE products SET
  description = 'Sour Diesel, affectionately known as Sour D, is a fast-acting sativa-dominant strain that delivers an energizing, dreamy cerebral high. This East Coast legend is famous for its pungent diesel-like aroma mixed with citrus and herbal notes. The strain provides an invigorating mental boost that promotes creativity, focus, and social engagement, making it perfect for daytime activities. Sour Diesel is highly effective for managing stress, depression, and chronic fatigue without inducing sedation. The light green buds are covered in orange pistils and a thick layer of trichomes, indicating high potency. Medical patients appreciate its ability to provide relief while maintaining mental clarity and functionality. This strain has become a staple in dispensaries worldwide due to its consistent effects and distinctive flavor profile. Sour Diesel is ideal for consumers seeking motivation and energy throughout their day.'
WHERE name LIKE '%Sour Diesel%';

-- Generic update for any products without descriptions
UPDATE products SET
  description = 'Premium cannabis flower cultivated by licensed farmers using sustainable growing practices. This strain has been laboratory tested for potency and purity, ensuring a safe and consistent experience. Each batch is carefully cured and trimmed to preserve terpene profiles and maximize flavor. Sourced directly from verified growers through the ZAPPAY platform, guaranteeing authenticity and quality. Perfect for consumers seeking reliable effects and exceptional value compared to traditional retail pricing.'
WHERE description IS NULL OR description = '';
