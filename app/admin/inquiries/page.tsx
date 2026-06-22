"use client";

import { useState } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Tabs from "@/components/ui/Tabs";
import AdminHeader from "@/components/admin/AdminHeader";
import { useAdminInquiries } from "@/hooks/useAdmin";
import { INQUIRY_STATUS_LABELS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

export default function AdminInquiriesPage() {
  const [filter, setFilter] = useState("all");
  const { data: inquiries = [], isLoading } = useAdminInquiries(true);

  const filtered =
    filter === "all"
      ? inquiries
      : inquiries.filter((i) => i.status === filter);

  return (
    <div>
      <AdminHeader title="문의 관리" description="1:1 문의를 확인하고 답변합니다." />

      <Tabs
        items={[
          { key: "all", label: "전체" },
          { key: "pending", label: "답변 대기" },
          { key: "answered", label: "답변 완료" },
        ]}
        activeKey={filter}
        onChange={setFilter}
        className="mb-6"
      />

      {isLoading ? (
        <p className="text-center text-gray-500 py-12">로딩 중...</p>
      ) : filtered.length === 0 ? (
        <Card><p className="text-center text-gray-500 py-8">문의가 없습니다.</p></Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((inquiry) => (
            <Link key={inquiry.id} href={`/admin/inquiries/${inquiry.id}`}>
              <Card className="hover:bg-gray/50 transition-colors flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={cn(
                        "text-xs font-bold px-2 py-0.5 rounded-full",
                        inquiry.status === "answered"
                          ? "bg-success/20 text-success"
                          : "bg-primary/30 text-secondary"
                      )}
                    >
                      {INQUIRY_STATUS_LABELS[inquiry.status]}
                    </span>
                    <span className="text-xs text-gray-400">{inquiry.nickname}</span>
                  </div>
                  <p className="font-bold text-secondary truncate">{inquiry.title}</p>
                  <p className="text-sm text-gray-500 truncate">{inquiry.content}</p>
                </div>
                <ChevronRight size={18} className="text-gray-400 shrink-0" />
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
