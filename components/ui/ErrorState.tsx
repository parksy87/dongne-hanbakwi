"use client";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  message = "데이터를 불러오지 못했습니다.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="text-center py-12 px-4">
      <div className="text-5xl mb-4">😥</div>
      <p className="text-lg font-bold text-secondary mb-2">잠시 문제가 생겼어요</p>
      <p className="text-gray-500 text-base mb-6">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-3 bg-primary text-secondary font-bold rounded-2xl text-base"
        >
          다시 시도
        </button>
      )}
    </div>
  );
}
