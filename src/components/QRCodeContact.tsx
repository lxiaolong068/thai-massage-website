import Image from 'next/image';

const QRCodeContact = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      <div className="flex flex-col items-center">
        <div className="bg-white p-2 rounded-lg mb-3">
          <Image 
            src="/images/line-qr-1.png" 
            alt="Line QR Code" 
            width={150} 
            height={150} 
          />
        </div>
        <p className="text-gray-300">Line QR Code</p>
      </div>
      
      <div className="flex flex-col items-center">
        <div className="bg-white p-2 rounded-lg mb-3">
          <Image 
            src="/images/tg-qr.jpg" 
            alt="Telegram QR Code" 
            width={150} 
            height={150} 
          />
        </div>
        <p className="text-gray-300">Telegram QR Code</p>
      </div>
      
      <div className="flex flex-col items-center">
        <div className="bg-white p-2 rounded-lg mb-3">
          <div className="w-[150px] h-[150px] relative">
            <Image 
              src="/images/wechat-qr.jpg" 
              alt="Wechat QR Code" 
              fill
              className="object-contain"
            />
          </div>
        </div>
        <p className="text-gray-300">Wechat QR Code</p>
      </div>
      
      <div className="flex flex-col items-center">
        <div className="bg-white p-2 rounded-lg mb-3">
          <Image 
            src="/images/whatsapp-qr.png" 
            alt="Whatsapp QR Code" 
            width={150} 
            height={150} 
          />
        </div>
        <p className="text-gray-300">Whatsapp QR Code</p>
      </div>
    </div>
  );
};

export default QRCodeContact; 