import invoice from '@core/assets/icons/features/invoice.svg'
import info from '@core/assets/icons/features/info.svg'
import Leading from '@core/assets/icons/features/Leading element.svg'
import print from '@core/assets/icons/features/print.svg'
import share from '@core/assets/icons/features/share.svg'
import { Grid } from 'antd';

export default function useFeatureHooks() {
    const { useBreakpoint } = Grid;
 const screens = useBreakpoint();
      const isDesktop = screens.lg;


    const features = [
        {
            text: "امکان تعیین نام نمایشی فروشگاه در بالای فاکتور",
            icon: invoice,
        },
        {
            text: "امکان تعیین شعار تبلیغاتی جهت نمایش به مشتری",
            icon: Leading,
        },
        {
            text: "امکان تعیین متن زیر نویس فاکتور (اطلاعات واریز و ...)",
            icon: info,
        },
        {
            text: "امکان اشتراک گذاری لینک مشاهده فاکتور توسط مشتری",
            icon: share,
        },
        {
            text: "امکان تعیین نسخه چاپی قابل دانلود (ساده / پیشرفته)",
            icon: print,
        },
    ];
    return {
        isDesktop,
        features
    }
}