'use client';
import { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const QRScanner = () => {
  const [scanResult, setScanResult] = useState<string | null>(null);

  useEffect(() => {
    // Inisialisasi scanner
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 5,
    }, false);

    scanner.render(onScanSuccess, onScanError);

    function onScanSuccess(decodedText: string, decodedResult: any) {
      scanner.clear(); // Hentikan scanner setelah berhasil
      setScanResult(decodedText);
      console.log(decodedResult);
    }

    function onScanError(err: any) {
      console.warn(err);
    }

    // Cleanup function
    return () => {
      scanner.clear().catch(error => {
        console.error("Gagal menghentikan scanner", error);
      });
    };
  }, []);

  return (
    <div>
      {scanResult ? (
        <div>
          Success: <a href={scanResult}>{scanResult}</a>
        </div>
      ) : (
        <div id="reader"></div>
      )}
    </div>
  );
};

export default QRScanner;
