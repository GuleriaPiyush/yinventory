import { useEffect, useRef, useState, useCallback } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";

// Plays a short cashier-style beep on successful scan
const playBeep = () => {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(850, audioCtx.currentTime); // 850 Hz tone
    gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.12);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.12);
  } catch (e) {
    console.error("Audio beep playback error:", e);
  }
};

const BarcodeScannerInline = ({ isOpen, onClose, onScan }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [continuous, setContinuous] = useState(false);
  const [scannedAlert, setScannedAlert] = useState("");
  const scannerRef = useRef(null);
  const isScanningRef = useRef(false);
  const lastScannedTimeRef = useRef(0);

  // Keep latest props/state in refs to prevent camera stream restarts
  const continuousRef = useRef(continuous);
  useEffect(() => {
    continuousRef.current = continuous;
  }, [continuous]);

  const onScanRef = useRef(onScan);
  useEffect(() => {
    onScanRef.current = onScan;
  }, [onScan]);

  const handleClose = useCallback(() => {
    if (scannerRef.current && isScanningRef.current) {
      scannerRef.current
        .stop()
        .then(() => {
          isScanningRef.current = false;
          try {
            scannerRef.current?.clear();
          } catch (err) {
            void err;
          }
          onClose();
        })
        .catch(() => {
          isScanningRef.current = false;
          onClose();
        });
    } else {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const qrRegionId = "barcode-scanner-viewport";

    // Supported barcode types (retail 1D barcodes and QR)
    const formatsToSupport = [
      Html5QrcodeSupportedFormats.EAN_13,
      Html5QrcodeSupportedFormats.EAN_8,
      Html5QrcodeSupportedFormats.CODE_128,
      Html5QrcodeSupportedFormats.CODE_39,
      Html5QrcodeSupportedFormats.UPC_A,
      Html5QrcodeSupportedFormats.UPC_E,
      Html5QrcodeSupportedFormats.QR_CODE,
    ];

    let isMounted = true;
    const html5QrCode = new Html5Qrcode(qrRegionId, {
      formatsToSupport,
      verbose: false,
    });
    scannerRef.current = html5QrCode;

    const config = {
      fps: 15,
      qrbox: { width: 280, height: 160 }, // Wide box for retail barcodes
      aspectRatio: 1.333,
    };

    const handleSuccess = (decodedText) => {
      const now = Date.now();
      // Debounce: prevent duplicate scans within 1.5 seconds of the same code
      if (now - lastScannedTimeRef.current < 1500) return;
      lastScannedTimeRef.current = now;

      playBeep();
      setScannedAlert(`Scanned: ${decodedText}`);

      onScanRef.current?.(decodedText);

      if (!continuousRef.current) {
        handleClose();
      } else {
        setTimeout(() => setScannedAlert(""), 1200);
      }
    };

    html5QrCode
      .start(
        { facingMode: "environment" }, // Rear camera on phones/tablets
        config,
        handleSuccess,
        () => {}, // Ignored frame-level scanning failures
      )
      .then(() => {
        if (!isMounted) {
          html5QrCode
            .stop()
            .then(() => html5QrCode.clear())
            .catch((err) => {
              void err;
            });
          return;
        }
        isScanningRef.current = true;
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error("Failed to start camera:", err);
        setErrorMessage(
          "Camera access denied or not available. Please allow camera permissions.",
        );
      });

    return () => {
      isMounted = false;
      if (scannerRef.current && isScanningRef.current) {
        scannerRef.current
          .stop()
          .then(() => {
            try {
              scannerRef.current?.clear();
            } catch (err) {
              void err;
            }
          })
          .catch((err) => console.error("Error stopping scanner:", err));
        isScanningRef.current = false;
      }
    };
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  return (
    <div className="mb-6 bg-slate-900 text-white rounded-xl shadow-md border border-slate-700 overflow-hidden transition-all duration-200">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <div>
            <h3 className="font-semibold text-white text-sm">
              Live Barcode Scanner
            </h3>
            <p className="text-[11px] text-slate-300">
              Align product barcode in the frame
            </p>
          </div>
        </div>
        <button
          onClick={handleClose}
          className="px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-slate-700 hover:bg-slate-600 rounded-md transition-colors cursor-pointer flex items-center gap-1"
          title="Close scanner"
        >
          <span>✕</span> Close
        </button>
      </div>

      {/* Viewfinder Area */}
      <div className="relative bg-black flex flex-col items-center justify-center overflow-hidden min-h-[240px] max-h-[360px] p-2">
        <div id="barcode-scanner-viewport" className="w-full max-w-[440px]">
          <style>{`
            #barcode-scanner-viewport video {
              width: 100% !important;
              max-height: 320px !important;
              object-fit: cover !important;
              border-radius: 0.5rem;
            }
            #barcode-scanner-viewport {
              border: none !important;
            }
          `}</style>
        </div>

        {scannedAlert && (
          <div className="absolute top-4 bg-emerald-500 text-white px-3.5 py-1 rounded-full text-xs font-semibold shadow-lg animate-bounce">
            ✓ {scannedAlert}
          </div>
        )}

        {errorMessage && (
          <div className="p-4 text-center text-rose-300 text-xs">
            {errorMessage}
          </div>
        )}
      </div>

      {/* Footer Controls */}
      <div className="px-4 py-2.5 bg-slate-800 flex items-center justify-between border-t border-slate-700 text-xs">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={continuous}
            onChange={(e) => setContinuous(e.target.checked)}
            className="w-3.5 h-3.5 text-indigo-500 rounded border-slate-600 focus:ring-indigo-400"
          />
          <span className="text-slate-200 font-medium">
            Continuous scan mode (keep camera open)
          </span>
        </label>

        <span className="text-[11px] text-slate-400 hidden sm:inline">
          Auto-adds items directly to bill
        </span>
      </div>
    </div>
  );
};

export default BarcodeScannerInline;
