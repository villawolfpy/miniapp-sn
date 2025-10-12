'use client';

export default function MiniAppFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md mx-auto text-center p-6">
        <div className="mb-6">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">SN Reader</h1>
          <p className="text-gray-600 mb-4">
            Una Mini App de Farcaster para leer Stacker News
          </p>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center mb-2">
            <svg className="w-5 h-5 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <h3 className="text-sm font-medium text-yellow-800">Mini Apps no soportadas</h3>
          </div>
          <p className="text-sm text-yellow-700">
            Por favor abre esto en un cliente de Farcaster que soporte Mini Apps.
          </p>
        </div>

        <div className="space-y-3">
          <a
            href="https://warpcast.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors inline-block"
          >
            Abrir en Warpcast
          </a>
        </div>

        <div className="mt-6 text-xs text-gray-500">
          <p>Comparte este enlace en Farcaster para usar la Mini App</p>
        </div>
      </div>
    </div>
  );
}
