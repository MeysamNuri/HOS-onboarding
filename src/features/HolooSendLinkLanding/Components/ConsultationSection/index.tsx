import { MailOutlined, PhoneOutlined } from "@ant-design/icons";

import useConsultationForm from "../../Hooks/useConsultationForm";

import "./styles.scss";

const chartValues = [58, 78, 66, 91, 83, 100];
const chartMonths = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور"];

export default function ConsultationSection() {
  const { form, isLoading, isSubmitted, handleSubmit, updateField } = useConsultationForm();

  return (
    <section className="landing-consultation" id="landing-consultation">
      <div className="landing-consultation__intro">
        <h2>با تیم ما در ارتباط باشید</h2>
        <p>
          تیم پشتیبانی و نمایندگی‌های هلو در سراسر کشور آماده راهنمایی شما هستند.
          فرم درخواست مشاوره را تکمیل کنید تا کارشناسان ما در سریع‌ترین زمان با شما تماس بگیرند.
        </p>

        <div className="landing-consultation__chart-card">
          <header>
            <strong>آمار ارسال لینک</strong>
            <span>این ماه</span>
          </header>
          <div className="landing-consultation__chart">
            {chartValues.map((value, index) => (
              <div key={chartMonths[index]}>
                <i style={{ height: `${value}%` }} />
                <span>{chartMonths[index]}</span>
              </div>
            ))}
          </div>
          <footer>
            <strong>۲۳٪ رشد ↑</strong>
            <span>مجموع ارسال: ۶۰۰ فاکتور</span>
          </footer>
        </div>

        <div className="landing-consultation__contact-list">
          <div>
            <span><PhoneOutlined /></span>
            <p>پشتیبانی فنی<strong>00000000000</strong></p>
          </div>
          <div>
            <span><MailOutlined /></span>
            <p>ایمیل پشتیبانی<a href="mailto:contact@example.invalid">contact@example.invalid</a></p>
          </div>
        </div>
      </div>

      <form className="landing-consultation__form" onSubmit={handleSubmit}>
        <h2>فرم درخواست مشاوره رایگان انتخاب بسته</h2>
        <label>
          نام و نام خانوادگی
          <input
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            placeholder="نام خود را وارد کنید"
            required
          />
        </label>
        <label>
          شماره موبایل
          <input
            value={form.mobile}
            onChange={(event) => updateField("mobile", event.target.value)}
            placeholder="09XX-XXX-XXXX"
            inputMode="tel"
            required
          />
        </label>
        <label>
          توضیحات (اختیاری)
          <textarea
            value={form.description}
            onChange={(event) => updateField("description", event.target.value)}
            placeholder="سوال یا درخواست خود را بنویسید..."
            rows={4}
          />
        </label>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "در حال ارسال..." : "ارسال درخواست"}
        </button>
        <p>{isSubmitted ? "درخواست شما با موفقیت ثبت شد." : "کارشناسان ما حداکثر تا ۲ ساعت کاری پاسخگو هستند."}</p>
      </form>
    </section>
  );
}
