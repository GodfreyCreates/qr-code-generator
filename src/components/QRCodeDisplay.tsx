import React, { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Download, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { QRCodeConfig } from '../types/qrcode';

interface QRCodeDisplayProps {
  config: QRCodeConfig;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ config }) => {
  const qrRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = React.useState(false);

  const downloadQRCode = (format: 'png' | 'jpeg' | 'svg') => {
    if (!qrRef.current) return;
    
    const canvas = qrRef.current.querySelector('canvas');
    if (!canvas) return;
    
    let dataUrl;
    let fileName;
    
    if (format === 'svg') {
      // For SVG, we need to create an SVG element
      const svgData = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${config.size}" height="${config.size}">
          <rect width="100%" height="100%" fill="${config.bgColor}"/>
          <image href="${canvas.toDataURL('image/png')}" width="100%" height="100%"/>
        </svg>
      `;
      dataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgData);
      fileName = `qrcode-${Date.now()}.svg`;
    } else {
      // For PNG/JPEG
      dataUrl = canvas.toDataURL(`image/${format}`);
      fileName = `qrcode-${Date.now()}.${format}`;
    }

    // Create an anchor element and trigger download
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(`QR code downloaded as ${format.toUpperCase()}`);
  };

  const copyQRCodeToClipboard = async () => {
    if (!qrRef.current) return;
    
    const canvas = qrRef.current.querySelector('canvas');
    if (!canvas) return;
    
    try {
      const dataUrl = canvas.toDataURL('image/png');
      
      // Convert dataURL to blob
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      
      // Copy blob to clipboard
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ]);
      
      setCopied(true);
      toast.success('QR code copied to clipboard');
      
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy QR code');
      console.error('Failed to copy QR code:', err);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div 
        ref={qrRef}
        className="qr-wrapper mb-6"
        style={{ backgroundColor: config.bgColor }}
      >
        <QRCodeCanvas
          value={config.value || ' '}
          size={config.size}
          bgColor={config.bgColor}
          fgColor={config.fgColor}
          level={config.level as 'L' | 'M' | 'Q' | 'H'}
          includeMargin={config.includeMargin}
          imageSettings={config.imageSettings}
        />
      </div>
      
      <div className="w-full space-y-4">
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => downloadQRCode('png')}
            className="btn-secondary flex-1 flex items-center justify-center gap-1 min-w-24"
          >
            <Download size={18} />
            <span>PNG</span>
          </button>
          <button 
            onClick={() => downloadQRCode('jpeg')}
            className="btn-secondary flex-1 flex items-center justify-center gap-1 min-w-24"
          >
            <Download size={18} />
            <span>JPEG</span>
          </button>
          <button 
            onClick={() => downloadQRCode('svg')}
            className="btn-secondary flex-1 flex items-center justify-center gap-1 min-w-24"
          >
            <Download size={18} />
            <span>SVG</span>
          </button>
        </div>
        
        <button 
          onClick={copyQRCodeToClipboard}
          className="btn-outline w-full flex items-center justify-center gap-1 dark:text-white"
          disabled={copied}
        >
          {copied ? (
            <>
              <Check size={18} className="text-success-500" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy size={18} />
              <span>Copy to Clipboard</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default QRCodeDisplay;