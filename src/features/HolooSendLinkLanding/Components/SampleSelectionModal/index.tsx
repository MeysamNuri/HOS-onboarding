import BottomModal from "@/core/components/customModal";
import invoiceImage from "@/core/assets/images/landing/sample-invoice.png";
import individualImage from "@/core/assets/images/landing/sample-individual.png";
import invoiceMobileImage from "@/core/assets/images/landing/sample-invoice-mobile.png";
import individualMobileImage from "@/core/assets/images/landing/sample-individual-mobile.png";
import type { SampleDocumentType } from "../../types";
import "./styles.scss";

interface SampleSelectionModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (type: SampleDocumentType) => void;
}

export default function SampleSelectionModal({ open, onClose, onSelect }: SampleSelectionModalProps) {
  return (
    <BottomModal open={open} onClose={onClose} width="960px" fitContent modalTitle="ارسال نمونه">
        <div className="sample-selection sample-selection-modal" dir="rtl">
          <header className="sample-selection__mobile-header">
            <h2>ارسال نمونه</h2>
            <button type="button" onClick={onClose} aria-label="بستن">×</button>
          </header>
          <p className="sample-selection__question">کدام سند را می‌خواهید از نگاه مشتری تجربه کنید؟</p>
          <div className="sample-selection__cards">
            <article className="sample-selection__card sample-selection__card--invoice">
              <picture className="sample-selection__preview">
                <source media="(max-width: 991px)" srcSet={invoiceMobileImage} />
                <img src={invoiceImage} alt="پیش‌نمایش نمونه فاکتور روی موبایل" />
              </picture>
              <div className="sample-selection__content">
                <h3>فاکتور</h3>
                <p>نمایش فاکتور، جزئیات پرداخت و امکان دانلود و اشتراک‌گذاری</p>
                <button type="button" onClick={() => onSelect("invoice")}>ارسال نمونه فاکتور</button>
              </div>
            </article>
            <article className="sample-selection__card sample-selection__card--individual">
              <picture className="sample-selection__preview">
                <source media="(max-width: 991px)" srcSet={individualMobileImage} />
                <img src={individualImage} alt="پیش‌نمایش نمونه معین اشخاص روی موبایل" />
              </picture>
              <div className="sample-selection__content">
                <h3>معین اشخاص</h3>
                <p>نمایش گردش حساب و مانده مشتری همراه با امکان جست‌وجو و فیلتر</p>
                <button type="button" onClick={() => onSelect("individual")}>ارسال معین اشخاص</button>
              </div>
            </article>
          </div>
        </div>
    </BottomModal>
  );
}
