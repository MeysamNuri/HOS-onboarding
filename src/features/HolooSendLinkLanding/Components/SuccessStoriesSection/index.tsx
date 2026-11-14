
import { Autoplay } from "swiper/modules";
import { useState } from "react";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import { Swiper, SwiperSlide } from "swiper/react";

import trophyImage from "@/core/assets/images/landing/extracted/success-trophy.png";
import defaultGuildIcon from "@/core/assets/images/senf-codes/Default.png";

import type { IGetStatistics } from "../../types";
import { getPacketTone } from "../../helper/statistics";
import { createCardPalette, getCardColors } from "../../helper/cardColors";

import "./styles.scss";

const guildIcons = import.meta.glob<string>("/src/core/assets/images/senf-codes/*.png", {
  eager: true,
  query: "?url",
  import: "default",
});

export default function SuccessStoriesSection({ consumers }: { consumers: IGetStatistics["topConsumers"] }) {
  const [cardPalette] = useState(createCardPalette);
  const successStories = consumers.map((consumer) => {
    const tone = getPacketTone(consumer.packet);
    return {
      title: consumer.businessName,
      subtitle: [consumer.firstName, consumer.lastName].filter(Boolean).join(" ") || consumer.guildName,
      guildName: consumer.guildName,
      icon: guildIcons[`/src/core/assets/images/senf-codes/${consumer.guildCode?.trim()}.png`] ?? defaultGuildIcon,
      value: consumer.sentCount.toLocaleString("fa-IR"),
      plan: consumer.packet,
      tone,
      experience: consumer.userExperience,
    };
  });
  if (!successStories.length) return null;
  return (
    <section className="landing-stories">
      <header className="landing-section-heading">
        <h2> برترین‌های اشتراک آنلاین اسناد</h2>
        <p>کسب‌وکارهایی که تجربه و تعامل بهتری در ۳۰ روز اخیر برای مشتریان خود ساخته‌اند.</p>
      </header>
      <div className="landing-stories__content">
        <div className="landing-stories__trophy-crop" aria-hidden="true">
          <img src={trophyImage} alt="" />
        </div>
        <Swiper
          className="landing-stories__list"
          modules={[Autoplay]}
          slidesPerView="auto"
          spaceBetween={12}
          speed={850}
          loop={successStories.length > 2}
          autoplay={{
            delay: 2200,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          dir="rtl"
          aria-label="برترین‌های اشتراک آنلاین اسناد"
        >
          {successStories.map((story, index) => {
            return (
              <SwiperSlide className="landing-stories__slide" key={`${story.title}-${index}`}>
                <article className={`landing-stories__card landing-stories__card--${story.tone} landing-stories__card--with-experience`} style={getCardColors(cardPalette, index)}>
                  <span className="landing-stories__plan">{story.plan}</span>
                  <div className="landing-stories__identity">
                    <span className="landing-stories__icon" title={story.guildName} aria-hidden="true">
                      <img
                        src={story.icon}
                        alt=""
                        style={{width:"38px",height:"38px"}}
                        onError={(event) => {
                          if (event.currentTarget.getAttribute("src") !== defaultGuildIcon) {
                            event.currentTarget.src = defaultGuildIcon;
                          }
                        }}
                      />
                    </span>
                    <div>
                      <h3>{story.title}</h3>
                      <p>{story.subtitle}</p>
                    </div>
                  </div>
                  <div className="landing-stories__details">
                    <footer>تعداد ارتباط با مشتری <strong>{story.value}</strong></footer>
                    {story.experience && (
                      <div className="landing-stories__experience">
                        <FormatQuoteIcon className="landing-stories__quote-icon" aria-hidden="true" />
                        <span>تجربه کاربر</span>
                        <blockquote>{story.experience}</blockquote>
                      </div>
                    )}
                  </div>
                </article>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
}
