'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getBrowserLocale, Locale, useI18n } from '@/lib/i18n';
import { MiniAppProvider } from '@/components/MiniAppProvider';
import { ArrowLeft, ExternalLink, Share2, Wallet } from 'lucide-react';
import { useMiniApp, type Address, type Hex } from '@/lib/miniapp';
import { truncateAddress, truncateHex } from '@/lib/utils';
import { fetchPostById, type SnPost } from '@/lib/sn';

const TIP_ADDRESS: Address = '0x1234567890abcdef1234567890abcdef12345678';
const TIP_VALUE: Hex = `0x${BigInt('100000000000000').toString(16)}`;

type ShareProof = {
  message: string;
  signature: Hex;
};

function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<SnPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [locale, setLocale] = useState<Locale>('en');
  const [shareProof, setShareProof] = useState<ShareProof | null>(null);
  const [shareError, setShareError] = useState<string | null>(null);
  const [isSigning, setIsSigning] = useState(false);
  const [tipHash, setTipHash] = useState<string | null>(null);
  const [tipError, setTipError] = useState<string | null>(null);
  const [isSendingTip, setIsSendingTip] = useState(false);
  const { connectWallet, context, signMessage, sendTransaction, openUrl } = useMiniApp();
  const t = useI18n(locale);

  useEffect(() => {
    setLocale(getBrowserLocale());
  }, []);

  useEffect(() => {
    const loadPost = async () => {
      setLoading(true);
      try {
        const data = await fetchPostById(params.id as string);
        setPost(data);
      } catch (err) {
        console.error('Error fetching post:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [params.id]);

  const handleShare = async () => {
    if (!post) return;
    setShareError(null);
    setIsSigning(true);

    try {
      if (!context?.address) {
        await connectWallet();
      }

      const message = `${post.title}\n${post.url ?? ''}\n${new Date().toISOString()}`;
      const signature = await signMessage(message);

      setShareProof({ message, signature });
    } catch (error) {
      const message = error instanceof Error ? error.message : t.sessionFailed;
      setShareError(message);
    } finally {
      setIsSigning(false);
    }
  };

  const handleOpenInSN = () => {
    if (!post) return;
    const targetUrl = post.url ?? `https://stacker.news/items/${post.id}`;
    openUrl(targetUrl);
  };

  const handleTip = async () => {
    if (!post) return;
    setTipError(null);
    setTipHash(null);
    setIsSendingTip(true);

    try {
      if (!context?.address) {
        await connectWallet();
      }

      const hash = await sendTransaction({
        to: TIP_ADDRESS,
        value: TIP_VALUE,
      });
      setTipHash(hash);
    } catch (error) {
      const message = error instanceof Error ? error.message : t.tipError;
      setTipError(message);
    } finally {
      setIsSendingTip(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">{t.loading}</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Post not found</p>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center gap-3 justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/')}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <h1 className="text-lg font-bold text-gray-900">{t.postDetail}</h1>
          </div>
          {context?.address && (
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Wallet className="w-4 h-4" />
              <span className="font-mono text-gray-700">{truncateAddress(context.address)}</span>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-4">
        <article className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">{post.title}</h2>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-medium text-gray-700 uppercase tracking-wide">
                  {post.territoryName ?? post.territoryId}
                </span>
                {typeof post.score === 'number' && (
                  <span className="font-medium text-blue-600">
                    {post.score} {t.points}
                  </span>
                )}
                {post.author?.username && (
                  <span>
                    {t.by} {post.author.displayName ?? post.author.username}
                  </span>
                )}
                <span className="text-gray-400">
                  {new Date(post.createdAt).toLocaleString(locale)}
                </span>
              </div>
            </div>

            {post.body && <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{post.body}</p>}

            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={handleShare}
                disabled={isSigning}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60"
              >
                <Share2 className="w-4 h-4" />
                {isSigning ? t.connecting : t.signMessage}
              </button>

              <button
                onClick={handleOpenInSN}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                {t.openInSN}
              </button>

              <button
                onClick={handleTip}
                disabled={isSendingTip}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-60"
              >
                <Wallet className="w-4 h-4" />
                {isSendingTip ? t.connecting : t.tipButton}
              </button>
            </div>

            {shareError && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-md p-3">{shareError}</p>
            )}

            {shareProof && (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 space-y-2">
                <p className="font-semibold">{t.shareProofTitle}</p>
                <p>
                  <span className="font-medium">{t.shareProofMessage}:</span>{' '}
                  <span className="font-mono break-words text-[11px] text-emerald-900">{shareProof.message}</span>
                </p>
                <p>
                  <span className="font-medium">{t.shareProofSignature}:</span>{' '}
                  <span
                    className="font-mono break-words text-[11px] text-emerald-900"
                    title={shareProof.signature}
                  >
                    {truncateHex(shareProof.signature, 10, 8)}
                  </span>
                </p>
              </div>
            )}

            <div className="space-y-2 text-xs text-gray-600">
              <p>{t.tipRequirement}</p>
              {tipError && (
                <p className="text-red-600 bg-red-50 border border-red-100 rounded-md p-2">{tipError}</p>
              )}
              {tipHash && (
                <p className="text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md p-2">
                  {t.tipSuccess}: {truncateHex(tipHash, 12, 6)}
                </p>
              )}
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}

export default function PostDetail() {
  return (
    <MiniAppProvider>
      <PostDetailPage />
    </MiniAppProvider>
  );
}
