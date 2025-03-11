const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

// 创建images目录
const imagesDir = path.join(__dirname, '../public/images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// 示例图片URL列表
const images = [
  {
    url: 'https://i0.wp.com/www.luxeinacity.com/wp-content/uploads/2015/02/Indulge-in-a-Traditional-Thai-Massage-1.jpg',
    filename: 'traditional-thai-new.jpg',
    description: 'Traditional Thai Massage'
  },
  {
    url: 'https://q-xx.bstatic.com/xdata/images/hotel/max750/158324822.jpg?k=a21f09222086aeb4a316d65a5395a1a48c8c238b7e057786b6ad4a282a398cd6&o=',
    filename: 'neck-shoulder-new.jpg',
    description: 'Neck & Shoulder Massage (New)'
  },
  {
    url: 'https://images.squarespace-cdn.com/content/v1/5e93976dfbecac6e44fe5075/1694413791236-XBJFRV701VX2EYRNUPK2/Screenshot+2023-09-11+at+07.29.39.png',
    filename: 'oil-massage-new.jpg',
    description: 'Oil Massage'
  },
  {
    url: 'https://guide2thailand.com/wp-content/uploads/2020/06/Aroma-Therapy-Massage.jpg',
    filename: 'aromatherapy-massage.jpg',
    description: 'Aromatherapy Massage'
  },
  {
    url: 'https://www.somareiwellness.com/wp-content/uploads/Deep-Tissue-Massage-3.jpg',
    filename: 'deep-tissue-new.jpg',
    description: 'Deep Tissue Massage (New)'
  },
  {
    url: 'https://dropinblog.net/34240617/files/Foot_Massage_Hero.jpg',
    filename: 'foot-massage.jpg',
    description: 'Foot Massage'
  },
  {
    url: 'https://www.thetopsecret-th.com/wp-content/uploads/2024/09/intro.png',
    filename: 'intro.png',
    description: 'Introduction image'
  },
  {
    url: 'https://www.thetopsecret-th.com/wp-content/uploads/2024/09/G-1.jpg',
    filename: 'gallery-1.jpg',
    description: 'Gallery image 1'
  },
  {
    url: 'https://www.thetopsecret-th.com/wp-content/uploads/2024/09/G-5.jpg',
    filename: 'gallery-5.jpg',
    description: 'Gallery image 5'
  },
  {
    url: 'https://www.thetopsecret-th.com/wp-content/uploads/2024/09/G-3.jpg',
    filename: 'gallery-3.jpg',
    description: 'Gallery image 3'
  },
  {
    url: 'https://www.thetopsecret-th.com/wp-content/uploads/2024/09/G-2.jpg',
    filename: 'gallery-2.jpg',
    description: 'Gallery image 2'
  },
  {
    url: 'https://www.thetopsecret-th.com/wp-content/uploads/2024/09/G-4.jpg',
    filename: 'gallery-4.jpg',
    description: 'Gallery image 4'
  },
  {
    url: 'https://www.thetopsecret-th.com/wp-content/uploads/2024/09/The-topsecretoucall-massage.png',
    filename: 'topsecret-massage.png',
    description: 'Top Secret outcall massage image'
  },
  {
    url: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874',
    filename: 'hero-bg.jpg',
    description: 'Hero background image'
  },
  {
    url: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1',
    filename: 'massage-intro.jpg',
    description: 'Introduction image'
  },
  {
    url: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35',
    filename: 'traditional-thai.jpg',
    description: 'Traditional Thai massage'
  },
  {
    url: 'https://images.unsplash.com/photo-1620733723572-11c53fc809a9',
    filename: 'aroma-oil.jpg',
    description: 'Aroma oil massage'
  },
  {
    url: 'https://images.unsplash.com/photo-1611073761523-4e3f4a4f1831',
    filename: 'hot-oil.jpg',
    description: 'Hot oil massage'
  },
  {
    url: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15',
    filename: 'cta-bg.jpg',
    description: 'Call to action background'
  },
  {
    url: 'https://images.unsplash.com/photo-1596178060810-72660ee8d99e',
    filename: 'booking-bg.jpg',
    description: 'Booking page background'
  },
  {
    url: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7',
    filename: 'testimonial-1.jpg',
    description: 'Testimonial 1'
  },
  {
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    filename: 'testimonial-2.jpg',
    description: 'Testimonial 2'
  },
  {
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    filename: 'testimonial-3.jpg',
    description: 'Testimonial 3'
  },
  {
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    filename: 'testimonial-4.jpg',
    description: 'Testimonial 4'
  },
  {
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
    filename: 'therapist-1.jpg',
    description: 'Therapist 1'
  },
  {
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956',
    filename: 'therapist-2.jpg',
    description: 'Therapist 2'
  },
  {
    url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04',
    filename: 'therapist-3.jpg',
    description: 'Therapist 3'
  },
  {
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
    filename: 'therapist-4.jpg',
    description: 'Therapist 4'
  },
  {
    url: 'https://cdn-icons-png.flaticon.com/512/2553/2553651.png',
    filename: 'aromatherapy-new.png',
    description: 'Aromatherapy icon (PNG format)'
  }
];

// 图标
const icons = [
  {
    url: 'https://cdn-icons-png.flaticon.com/512/2829/2829855.png',
    filename: 'icon-1.png',
    description: 'Icon 1'
  },
  {
    url: 'https://cdn-icons-png.flaticon.com/512/2829/2829813.png',
    filename: 'icon-2.png',
    description: 'Icon 2'
  },
  {
    url: 'https://cdn-icons-png.flaticon.com/512/2829/2829819.png',
    filename: 'icon-3.png',
    description: 'Icon 3'
  },
  {
    url: 'https://cdn-icons-png.flaticon.com/512/2829/2829865.png',
    filename: 'back-shoulder.png',
    description: 'Back & Shoulder icon'
  },
  {
    url: 'https://cdn-icons-png.flaticon.com/512/2829/2829823.png',
    filename: 'oil-massage.png',
    description: 'Oil massage icon'
  },
  {
    url: 'https://cdn-icons-png.flaticon.com/512/2829/2829859.png',
    filename: 'swedish-massage.png',
    description: 'Swedish massage icon'
  },
  {
    url: 'https://cdn-icons-png.flaticon.com/512/2829/2829866.png',
    filename: 'aromatherapy.png',
    description: 'Aromatherapy icon'
  },
  {
    url: 'https://cdn-icons-png.flaticon.com/512/2829/2829825.png',
    filename: 'reflexology.png',
    description: 'Reflexology icon'
  }
];

// 下载图片函数
function downloadImage(url, filename, description) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(imagesDir, filename);
    
    // 检查文件是否已存在
    if (fs.existsSync(filePath)) {
      console.log(`${filename} already exists. Skipping...`);
      resolve();
      return;
    }
    
    console.log(`Downloading ${description} (${filename})...`);
    
    const file = fs.createWriteStream(filePath);
    https.get(`${url}?auto=format&fit=crop&w=800&q=80`, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded ${filename}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filePath, () => {}); // 删除不完整的文件
      console.error(`Error downloading ${filename}: ${err.message}`);
      reject(err);
    });
  });
}

// 创建scripts目录（如果不存在）
if (!fs.existsSync(path.join(__dirname, '../scripts'))) {
  fs.mkdirSync(path.join(__dirname, '../scripts'), { recursive: true });
}

// 下载所有图片
async function downloadAllImages() {
  try {
    // 下载照片
    for (const image of images) {
      await downloadImage(image.url, image.filename, image.description);
    }
    
    // 下载图标
    for (const icon of icons) {
      await downloadImage(icon.url, icon.filename, icon.description);
    }
    
    console.log('All images downloaded successfully!');
  } catch (error) {
    console.error('Error downloading images:', error);
  }
}

// 执行下载
downloadAllImages(); 