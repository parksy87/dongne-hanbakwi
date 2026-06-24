"use client";

import Link from "next/link";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Inquiry } from "@/types";
import { INQUIRY_STATUS_LABELS, getInquiryCategoryLabel } from "@/lib/constants";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface InquiryListProps {
  inquiries: Inquiry[];
  onDelete?: (inquiry: Inquiry) => void;
  deletePending?: boolean;
  canDelete?: (inquiry: Inquiry) => boolean;
  detailHref?: (id: string) => string;
}

function formatInquiryDate(inquiry: Inquiry): string {
  const date = inquiry.createdAt?.toDate?.();
  if (!date) return "";
  return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
}

export default function InquiryList({
  inquiries,
  onDelete,
  deletePending = false,
  canDelete = (inquiry) => inquiry.status === "pending",
  detailHref = (id) => `/inquiries/${id}`,
}: InquiryListProps) {
  if (inquiries.length === 0) {
    return (
      <Card>
        <p className="text-center text-gray-500 py-10 leading-relaxed">
          아직 문의 내역이 없습니다.
          <br />
          궁금한 점이 있으면 문의해 주세요.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {inquiries.map((inquiry) => (
        <Card key={inquiry.id} className="hover:bg-gray/50 transition-colors">
          <div className="flex items-start justify-between gap-3">
            <Link href={detailHref(inquiry.id)} className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span
                  className={cn(
                    "text-xs font-bold px-2 py-0.5 rounded-full",
                    inquiry.status === "answered"
                      ? "bg-success/20 text-success"
                      : "bg-gray text-gray-500"
                  )}
                >
                  {INQUIRY_STATUS_LABELS[inquiry.status] ?? "답변 대기"}
                </span>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/20 text-secondary">
                  {getInquiryCategoryLabel(inquiry.category)}
                </span>
                <span className="text-xs text-gray-400">
                  {formatInquiryDate(inquiry)}
                </span>
              </div>
              <p className="font-bold text-secondary truncate">{inquiry.title}</p>
              <p className="text-sm text-gray-500 truncate mt-1">
                {inquiry.content}
              </p>
            </Link>
            <div className="flex items-center gap-2 shrink-0 mt-1">
              {onDelete && canDelete(inquiry) && (
                <Button
                  size="sm"
                  variant="danger"
                  onClick={(e) => {
                    e.preventDefault();
                    onDelete(inquiry);
                  }}
                  disabled={deletePending}
                >
                  삭제
                </Button>
              )}
              <Link href={detailHref(inquiry.id)}>
                <ChevronRight size={18} className="text-gray-400" />
              </Link>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
