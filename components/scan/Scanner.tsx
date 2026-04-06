"use client"

import { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

interface QRScannerProps {
  onScan: (result: string | null) => void;
  elementId?: string;
}

function cleanScanResult(rawText: string): string | null {
  if (!rawText || rawText === "undefined") {
    return null;
  }

  let cleaned = rawText.trim();

  if (cleaned.includes(":")) {
    cleaned = cleaned.split(":")[0].trim();
  }

  if (cleaned.includes(",")) {
    cleaned = cleaned.split(",")[0].trim();
  }

  if (!cleaned || cleaned === "undefined") {
    return null;
  }

  console.log("Cleaned scan result:", rawText, "->", cleaned);
  return cleaned;
}

export const QRScannerAsset: React.FC<QRScannerProps> = ({ onScan, elementId = 'reader' }) => {
  useEffect(() => {
    console.log(`[QRScannerAsset] Effect mounted for element: ${elementId}`);

    let scanner: any;
    let isActive = true;

    const initialize = async () => {
      if (!isActive) return;

      try {
        // Check element exists and is in DOM
        const element = document.getElementById(elementId);
        if (!element) {
          console.warn(`[QRScannerAsset] Element ${elementId} not found in DOM`);
          return;
        }

        // Verify element is visible and has dimensions
        const rect = element.getBoundingClientRect();
        console.log(`[QRScannerAsset] Element size: ${rect.width}x${rect.height}`);

        if (rect.width === 0 || rect.height === 0) {
          console.warn(`[QRScannerAsset] Element has no visible dimensions`);
          return;
        }

        console.log(`[QRScannerAsset] Creating Html5QrcodeScanner`);

        scanner = new Html5QrcodeScanner(
          elementId,
          {
            qrbox: { width: 250, height: 250 },
            fps: 5,
            aspectRatio: 1,
          },
          false
        );

        const handleSuccess = (decodedText: string) => {
          const cleaned = cleanScanResult(decodedText);
          if (cleaned && isActive) {
            console.log(`[QRScannerAsset] Scan success: ${cleaned}`);
            if (scanner && isActive) {
              try {
                scanner.clear();
              } catch (e) {
                console.warn(`[QRScannerAsset] Error clearing scanner:`, e);
              }
            }
            onScan(cleaned);
          }
        };

        const handleError = (error: any) => {
          // Silently ignore continuous scan errors
        };

        console.log(`[QRScannerAsset] Calling scanner.render()`);
        await scanner.render(handleSuccess, handleError);
        console.log(`[QRScannerAsset] Scanner rendered successfully`);
      } catch (error) {
        console.error(`[QRScannerAsset] Initialization error:`, error);
        if (scanner) {
          try {
            await scanner.clear();
          } catch (e) {
            console.warn(`[QRScannerAsset] Error during error cleanup:`, e);
          }
        }
      }
    };

    // Delay to ensure DOM is fully ready
    const timer = setTimeout(initialize, 150);

    return () => {
      isActive = false;
      clearTimeout(timer);

      if (scanner) {
        try {
          console.log(`[QRScannerAsset] Cleanup: stopping scanner`);
          scanner.clear();
        } catch (e) {
          console.warn(`[QRScannerAsset] Cleanup error:`, e);
        }
      }
    };
  }, [onScan, elementId]);

  return null;
};

export const QRScannerItem: React.FC<QRScannerProps> = ({ onScan, elementId = 'reader' }) => {
  useEffect(() => {
    console.log(`[QRScannerItem] Effect mounted for element: ${elementId}`);

    let scanner: any;
    let isActive = true;

    const initialize = async () => {
      if (!isActive) return;

      try {
        // Check element exists and is in DOM
        const element = document.getElementById(elementId);
        if (!element) {
          console.warn(`[QRScannerItem] Element ${elementId} not found in DOM`);
          return;
        }

        // Verify element is visible and has dimensions
        const rect = element.getBoundingClientRect();
        console.log(`[QRScannerItem] Element size: ${rect.width}x${rect.height}`);

        if (rect.width === 0 || rect.height === 0) {
          console.warn(`[QRScannerItem] Element has no visible dimensions`);
          return;
        }

        console.log(`[QRScannerItem] Creating Html5QrcodeScanner`);

        scanner = new Html5QrcodeScanner(
          elementId,
          {
            qrbox: { width: 250, height: 250 },
            fps: 5,
            aspectRatio: 1,
          },
          false
        );

        const handleSuccess = (decodedText: string) => {
          const cleaned = cleanScanResult(decodedText);
          if (cleaned && isActive) {
            console.log(`[QRScannerItem] Scan success: ${cleaned}`);
            if (scanner && isActive) {
              try {
                scanner.clear();
              } catch (e) {
                console.warn(`[QRScannerItem] Error clearing scanner:`, e);
              }
            }
            onScan(cleaned);
          }
        };

        const handleError = (error: any) => {
          // Silently ignore continuous scan errors
        };

        console.log(`[QRScannerItem] Calling scanner.render()`);
        await scanner.render(handleSuccess, handleError);
        console.log(`[QRScannerItem] Scanner rendered successfully`);
      } catch (error) {
        console.error(`[QRScannerItem] Initialization error:`, error);
        if (scanner) {
          try {
            await scanner.clear();
          } catch (e) {
            console.warn(`[QRScannerItem] Error during error cleanup:`, e);
          }
        }
      }
    };

    // Delay to ensure DOM is fully ready
    const timer = setTimeout(initialize, 150);

    return () => {
      isActive = false;
      clearTimeout(timer);

      if (scanner) {
        try {
          console.log(`[QRScannerItem] Cleanup: stopping scanner`);
          scanner.clear();
        } catch (e) {
          console.warn(`[QRScannerItem] Cleanup error:`, e);
        }
      }
    };
  }, [onScan, elementId]);

  return null;
};
