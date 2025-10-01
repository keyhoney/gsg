import { Link } from "react-router-dom";

export const NotFoundPage = () => {
  return (
    <section className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
      <h2 className="text-3xl font-semibold">페이지를 찾을 수 없습니다</h2>
      <p className="text-muted-foreground">
        요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
      </p>
      <Link
        to="/"
        className="inline-flex items-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90"
      >
        홈으로 돌아가기
      </Link>
    </section>
  );
};
