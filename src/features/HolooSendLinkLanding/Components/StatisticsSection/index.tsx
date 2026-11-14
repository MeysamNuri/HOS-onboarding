import robotImage from "@/core/assets/images/landing/extracted/robot.png";
import leaf from "@/core/assets/images/landing/extracted/robot-2.png";
import views from "@/core/assets/images/landing/extracted/robot-3.png";
import share from "@/core/assets/images/landing/extracted/robot-4.png";
import pdf from "@/core/assets/images/landing/extracted/robot-5.png";

import type { IGetStatistics } from "../../types";

import "./styles.scss";

const statisticIcons = {
  robot: robotImage,
  leaf,
  views,
  share,
  pdf,
};

export default function StatisticsSection({ statistics, isLoading = false }: { statistics?: IGetStatistics; isLoading?: boolean }) {
  const landingStatistics = [
    { value: statistics?.activeUsersCount, label: "کسب‌وکار هوشمند", icon: "robot" },
    { value: statistics?.sentCount, label: "مصرف کاغذ کمتر", icon: "leaf" },
    { value: statistics?.viewCount, label: "تعداد مشاهده مشتریان", icon: "views" },
    { value: statistics?.shareCount, label: "اشتراک‌گذاری", icon: "share" },
    { value: statistics?.downloadCount, label: "دانلود PDF", icon: "pdf" },
  ];
  return (
    <section className="landing-statistics" aria-label="آمار اشتراک آنلاین اسناد" aria-busy={isLoading}>
      <div className="landing-statistics__inner">
        {landingStatistics.map((item) => (
          <article className="landing-statistics__item" key={item.label}>
            <span className={`landing-statistics__icon landing-statistics__icon--${item.icon}`}>
              <img
                src={statisticIcons[item.icon as keyof typeof statisticIcons]}
                alt=""
                aria-hidden="true"
              />
            </span>
            <strong dir="ltr">{item.value == null ? "—" : `+${item.value.toLocaleString("fa-IR")}`}</strong>
            <p>{item.label}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
