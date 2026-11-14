import { UserOutlined } from "@ant-design/icons";
import { useRef, useState } from "react";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import companionImage from "@/core/assets/images/landing/extracted/companion-team.png";
import WorkspacePremiumOutlined from "@mui/icons-material/WorkspacePremiumOutlined";

import type { IGetStatistics } from "../../types";
import { getPacketTone } from "../../helper/statistics";
import { createCardPalette, getCardColors } from "../../helper/cardColors";

import "./styles.scss"; 

export default function CompanionSection({ companions }: { companions: IGetStatistics["newCompanions"] }) {
  const [cardPalette] = useState(createCardPalette);
  const companionStories = companions.map((companion) => ({
    name: companion.businessName,
    field: [companion.firstName, companion.lastName].filter(Boolean).join(" "),
    plan: companion.packet,
    tone: getPacketTone(companion.packet),
  }));
  const viewportRef = useRef<HTMLDivElement>(null);


  const carouselStories = companionStories.length > 1 && companionStories.length < 8
    ? Array.from(
        { length: Math.ceil(8 / companionStories.length) },
        () => companionStories,
      ).flat()
    : companionStories;

  if (!companions.length) return null;

  return (
    <section className="landing-companions">
      <header className="landing-section-heading">
        <h2>همراهان جدید اشتراک آنلاین اسناد</h2>
        <p>کسب‌وکارهایی که در ۳۰ روز اخیر برای ارتباط آنلاین، سریع‌تر و حرفه‌ای‌تر با مشتریانشان به ما پیوسته‌اند.</p>
      </header>

      <div className="landing-companions__content">
        <div className="landing-companions__viewport" ref={viewportRef}>
        <Swiper
          className="landing-companions__list"
          // style={{ width: carouselWidth }}
          modules={[Autoplay]}
          slidesPerView="auto"
          spaceBetween={12}
          speed={850}
          loop={carouselStories.length > 2}
          autoplay={{
            delay: 2200,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
            reverseDirection: true,
          }}
          dir="rtl"
          aria-label="همراهان جدید اشتراک آنلاین اسناد"
        >
          {carouselStories.map((story, index) => (
            <SwiperSlide
              className="landing-companions__slide"
              key={`${story.name}-${index}`}
              aria-hidden={index >= companionStories.length}
            >
              <article className={`landing-companions__card landing-companions__card--${story.tone}`} style={getCardColors(cardPalette, index)}>
                <span className="landing-companions__avatar"><UserOutlined /></span>
                <div className="landing-companions__info">
                  <p><b>{story.name}</b><span>{story.plan}</span></p>
                  <strong><span className="landing-companions__medal" aria-hidden="true"><WorkspacePremiumOutlined style={{fontSize:"16px"}}/></span><span>{story.field}</span></strong>
                </div>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>
        </div>

        <div className="landing-companions__image-crop" aria-hidden="true">
          <img src={companionImage} alt="" />
        </div>
      </div>
    </section>
  );
}
