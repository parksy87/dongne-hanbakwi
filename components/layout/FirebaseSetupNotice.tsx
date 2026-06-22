"use client";

import Card from "@/components/ui/Card";

export default function FirebaseSetupNotice() {
  return (
    <Card className="w-full max-w-sm mb-6 border-2 border-primary bg-primary/10">
      <h2 className="text-lg font-bold text-secondary mb-2">
        Firebase 설정이 필요합니다
      </h2>
      <p className="text-sm text-secondary/80 mb-4 leading-relaxed">
        앱을 실행하려면 Firebase 연동 정보를 먼저 입력해야 합니다.
      </p>
      <ol className="text-sm text-secondary/90 space-y-2 list-decimal list-inside">
        <li>프로젝트 폴더에 <code className="bg-white px-1 rounded">.env.local</code> 파일 생성</li>
        <li><code className="bg-white px-1 rounded">.env.example</code> 내용을 복사</li>
        <li>Firebase Console 값으로 수정</li>
        <li>개발 서버 재시작 (<code className="bg-white px-1 rounded">npm run dev</code>)</li>
      </ol>
      <p className="text-xs text-gray-500 mt-4">
        Firebase Console → 프로젝트 설정 → 일반 → SDK 설정에서 값을 확인할 수 있습니다.
      </p>
    </Card>
  );
}
