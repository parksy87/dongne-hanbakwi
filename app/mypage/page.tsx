"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/layout/AuthGuard";
import Header from "@/components/layout/Header";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import BadgeGrid from "@/components/mypage/BadgeGrid";
import AvatarPicker from "@/components/mypage/AvatarPicker";
import ProfileAvatar from "@/components/common/ProfileAvatar";
import { useAuthStore } from "@/stores/authStore";
import { useUserBadges } from "@/hooks/useWorkouts";
import { useAppVersionSetting } from "@/hooks/useAppSettings";
import { signOut } from "@/services/authService";
import { updateUserProfile } from "@/services/userService";
import { resolveProfileImageSrc } from "@/lib/avatars";
import { toastError, toastSuccess } from "@/stores/toastStore";
import { formatDistance, formatDuration } from "@/lib/utils";
import {
  ChevronRight,
  User,
  MessageCircle,
  LogOut,
  Info,
  Target,
  Megaphone,
} from "lucide-react";

export default function MyPage() {
  const router = useRouter();
  const { user, setUser, reset } = useAuthStore();
  const { data: badges = [] } = useUserBadges(user?.uid);
  const appVersion = useAppVersionSetting();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [nickname, setNickname] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const createdDate = user?.createdAt?.toDate?.();
  const joinDate = createdDate
    ? `${createdDate.getFullYear()}년 ${createdDate.getMonth() + 1}월 ${createdDate.getDate()}일`
    : "";

  const stats = [
    { label: "연속 출석", value: `${user?.streak || 0}일` },
    { label: "총 거리", value: formatDistance(user?.totalDistance || 0) },
    { label: "총 운동시간", value: formatDuration(user?.totalDuration || 0) },
    { label: "총 운동횟수", value: `${user?.totalWorkoutCount || 0}회` },
  ];

  async function handleLogout() {
    await signOut();
    reset();
    router.replace("/login");
  }

  function openProfileModal() {
    if (!user) return;
    setNickname(user.nickname);
    setSelectedAvatar(resolveProfileImageSrc(user.profileImage, user.uid));
    setShowProfileModal(true);
  }

  async function handleProfileSave() {
    if (!user || !nickname.trim()) return;
    setIsSavingProfile(true);
    try {
      await updateUserProfile(user.uid, {
        nickname: nickname.trim(),
        profileImage: selectedAvatar,
      });
      setUser({
        ...user,
        nickname: nickname.trim(),
        profileImage: selectedAvatar,
      });
      toastSuccess("프로필이 저장되었습니다.");
      setShowProfileModal(false);
    } catch (e) {
      console.error(e);
      toastError("프로필 저장에 실패했습니다.");
    } finally {
      setIsSavingProfile(false);
    }
  }

  const menuItems = [
    { icon: User, label: "프로필 수정", action: openProfileModal },
    { icon: Target, label: "출석 목표", action: () => router.push("/mypage/settings") },
    { icon: Megaphone, label: "공지사항", action: () => router.push("/announcements") },
    { icon: MessageCircle, label: "문의하기", action: () => router.push("/inquiries") },
    { icon: LogOut, label: "로그아웃", action: handleLogout },
    { icon: Info, label: `앱 버전 v${appVersion}`, action: () => {} },
  ];

  return (
    <AuthGuard>
      <div className="page-container">
        <Header title="마이페이지" showNotification={false} />

        <Card className="mb-6">
          <div className="flex items-center gap-4">
            <ProfileAvatar
              profileImage={user?.profileImage}
              uid={user?.uid}
              nickname={user?.nickname}
              size="lg"
            />
            <div>
              <p className="text-xl font-bold text-secondary">{user?.nickname}</p>
              <p className="text-sm text-gray-500">
                Lv.{user?.level || 1} · {joinDate} 가입
              </p>
            </div>
          </div>
        </Card>

        <Card className="mb-6">
          <h3 className="text-base font-bold text-secondary mb-4">활동 통계</h3>
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
                <p className="text-lg font-bold text-secondary">{stat.value}</p>
              </div>
            ))}
          </div>
        </Card>

        <div className="mb-6">
          <BadgeGrid badges={badges} />
        </div>

        <Card padding="sm">
          {menuItems.map((item, index) => (
            <button
              key={item.label}
              onClick={item.action}
              className={`w-full flex items-center gap-3 px-3 py-4 hover:bg-gray/50 transition-colors ${
                index < menuItems.length - 1 ? "border-b border-gray-100" : ""
              }`}
            >
              <item.icon size={20} className="text-gray-500" />
              <span className="flex-1 text-left text-secondary font-medium">
                {item.label}
              </span>
              {item.label !== `앱 버전 v${appVersion}` && (
                <ChevronRight size={18} className="text-gray-400" />
              )}
            </button>
          ))}
        </Card>

        <Modal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          title="프로필 수정"
        >
          <div className="space-y-5">
            <div className="flex flex-col items-center gap-2">
              <ProfileAvatar
                profileImage={selectedAvatar}
                uid={user?.uid}
                nickname={nickname}
                size="xl"
              />
            </div>

            <AvatarPicker
              selectedPath={selectedAvatar}
              onSelect={setSelectedAvatar}
            />

            <div>
              <label className="text-sm font-bold text-secondary mb-2 block">
                닉네임
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full p-3 bg-gray rounded-xl text-secondary text-base focus:outline-none focus:ring-2 focus:ring-primary"
                maxLength={20}
              />
            </div>

            <Button
              size="lg"
              fullWidth
              onClick={handleProfileSave}
              disabled={isSavingProfile}
            >
              {isSavingProfile ? "저장 중..." : "저장"}
            </Button>
          </div>
        </Modal>
      </div>
    </AuthGuard>
  );
}
