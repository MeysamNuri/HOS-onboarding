import { Form, Input, Button, Row, Typography, Radio, Image, Select, Col, Switch } from 'antd';
import Advance from '@core/assets/images/advanced-invoice.png'
import Simple from '@core/assets/images/simple-invice.png'
import Informal from '@core/assets/images/informal-invoice.png'
import invoice from '@core/assets/icons/invoice-icon.svg'
import useSettingskHooks from '../hooks/settingsHooks'
import {
  InfoCircleOutlined,
  LeftOutlined
} from "@ant-design/icons";
const { TextArea } = Input;
const { Text, Link } = Typography
import "./styles/settings.scss"

import BottomModal from '@/core/components/customModal';
import StoreInfoForm from './settingInfoModal';
import AjaxLoadingComponent from '@/core/components/ajaxLoadingComponent';
import PagesHeader from '@/core/components/pagesHeader';

export default function Settings() {
  const { handleSubmitSetting, invoiceSettingLoading, settingsForm,
    setShowSimple,
    showSimple,
    setShowAdvance,
    showAdvance,
    showInfoModal,
    value,
    setShowInfoModal,
    userListLoading,
    selectedSerial,
    setSelctedSerial,
    usersSerialsList,
    setValue,
    getUserSettingLoading,
    enabledRemain,
    setEnabledRemain,
    setShowInformal,
    showInformal
  } = useSettingskHooks()


  const { Option } = Select;
  if (getUserSettingLoading) return <AjaxLoadingComponent />
  return (


    <Row className="settings-shell" style={{ width: "100%" }}>

      <Col span={24} >
        <div className="page-container">

          <div className="sub-container">
            <Form
              form={settingsForm}
              layout="vertical"
              initialValues={{
                invoiceType: 'simple', // 👈 default checked
              }}
              onFinish={handleSubmitSetting}

            >
              <div className="settings-scroll-content">
                <PagesHeader text="متن‌های سفارشی برای سربرگ، پاورقی و شعار تبلیغاتی خدمات شما. " title=" تنظیمات اشتراک آنلاین اسناد   " />
              <div className="business-settings">
                <Row style={{ justifyContent: "space-between" }} gutter={[0, 14]}>

                  <Text className='setting-title'>اطلاعات کسب و کار
                    <InfoCircleOutlined style={{ marginRight: "10px" }} onClick={() => setShowInfoModal(true)} />
                  </Text>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span>نمایش مانده حساب در فاکتور به مشتری</span>

                    <Switch
                      className="red-switch"
                      checked={enabledRemain}
                      onChange={setEnabledRemain}
                    />
                  </div>
                </Row>
                <Row gutter={[16, 16]} className="settings-card">
                  {/* Business Info */}
                  <Col md={{ span: 12 }} xs={{ span: 24 }}>

                    <Form.Item name="serial">
                      <Select
                        showSearch
                        onChange={(e) => setSelctedSerial(e)}
                        value={selectedSerial}
                        loading={userListLoading}
                        style={{ padding: "12px" }}
                        placeholder="سریال"

                      >
                        {
                          usersSerialsList?.Data?.serials?.map((i: string) =>
                            <Option value={i}>{i}</Option>
                          )
                        }

                      </Select>
                    </Form.Item>
                  </Col>
                  <Col md={12} sm={24} xs={24}>
                    <Form.Item name="storeName" rules={[
                      {
                        max: 68,
                        message: "حداکثر ۶۸ کاراکتر مجاز است.",
                      },
                    ]}>
                      <Input placeholder="نام کسب و کار " />
                    </Form.Item>
                  </Col>
                  <Col md={24} sm={24} xs={24}>
                    <Form.Item name="storeSlogan" rules={[
                      {
                        max: 250,
                        message: "حداکثر ۲۵۰ کاراکتر مجاز است.",
                      },
                    ]}>
                      <Input placeholder="شعار تبلیغاتی " />
                    </Form.Item>
                  </Col>
                  <Col md={24} sm={24} xs={24}>
                    <Form.Item name="footerText"
                      rules={[
                        {
                          max: 512,
                          message: "حداکثر ۵۱۲ کاراکتر مجاز است.",
                        },
                      ]}
                    >
                      <TextArea

                        rows={4}
                        placeholder="متن زیرنویس(جهت نمایش به مشتری در فرم فاکتور) "
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Text className="setting-title" >انواع فاکتور قابل چاپ</Text>

                <div className="settings-card">
                  {/* Invoice Type */}

                  <Form.Item name="invoiceType">


                    <div className="factor-wrapper">
                      <Radio.Group
                        onChange={(e) => setValue(e.target.value)}
                        value={value}
                        className="factor-group"
                      >
                        <Row gutter={[16, 16]} >
                          <Col xs={24} sm={24} md={8} style={{ width: "100%" }}>

                            {/* Simple */}
                            <Radio value="Simple" className="factor-card">
                              <div className="card-content">
                                <div className="icon-section">
                                  <Image src={invoice} preview={false} />
                                </div>
                                <div className="text-section">
                                  <div className="title">ساده</div>
                                  <div className="description">
                                    نمایش تنها مبلغ پایه و اطلاعات پایه فاکتور
                                  </div>

                                  <Link className="preview" onClick={() => setShowSimple(!showSimple)}>مشاهده پیش‌نمایش
                                    <LeftOutlined style={{ fontSize: 10, marginRight: "5px" }} />

                                    <Image src={Simple} style={{ display: showSimple ? "block" : "none" }} preview={{
                                      open: showSimple,
                                      onVisibleChange: (v) => setShowSimple(v),
                                    }} />
                                  </Link>
                                </div>

                              </div>
                            </Radio>
                          </Col>
                          <Col xs={24} sm={24} md={8}>
                            {/* informal */}
                            <Radio value="Informal" className="factor-card">
                              <div className="card-content">
                                <div className="icon-section">
                                  <Image src={invoice} preview={false} />
                                </div>
                                <div className="text-section">
                                  <div className="title">عمودی</div>
                                  <div className="description">
                                    نمایش حد اکثر تعداد اقلام در صفحه {<br />}
                                    امکان نمایش سریال کالاها
                                  </div>

                                  <Link className="preview" onClick={() => setShowInformal(!showInformal)}>مشاهده پیش‌نمایش
                                    <LeftOutlined style={{ fontSize: 10, marginRight: "5px" }} />
                                    <Image src={Informal} style={{ display: showInformal ? "block" : "none" }} preview={{
                                      open: showInformal,
                                      onVisibleChange: (v) => setShowInformal(v),
                                    }}
                                    />
                                  </Link>
                                </div>


                              </div>
                            </Radio>
                          </Col>
                          <Col xs={24} sm={24} md={8}>
                            {/* Advanced */}
                            <Radio value="Advance" className="factor-card">
                              <div className="card-content">
                                <div className="icon-section">
                                  <Image src={invoice} preview={false} />
                                </div>
                                <div className="text-section">
                                  <div className="title">پیشرفته</div>
                                  <div className="description">
                                    شامل مبلغ تخفیف، مجموع پس از تخفیف، مالیات بر ارزش افزوده
                                    و مبلغ نهایی قابل پرداخت
                                  </div>

                                  <Link className="preview" onClick={() => setShowAdvance(!showAdvance)}>مشاهده پیش‌نمایش
                                    <LeftOutlined style={{ fontSize: 10, marginRight: "5px" }} />

                                    <Image src={Advance} style={{ display: showAdvance ? "block" : "none" }} preview={{
                                      open: showAdvance,
                                      onVisibleChange: (v) => setShowAdvance(v),
                                    }}
                                    />
                                  </Link>
                                </div>


                              </div>
                            </Radio>
                          </Col>
                        </Row>
                      </Radio.Group>
                    </div>
                  </Form.Item>
                </div>

              </div>
              </div>
              <div className='submit-wrapper'>
                {/* Submit */}
                <Button htmlType='submit' size="large" className='buttons-styles' loading={invoiceSettingLoading}>
                  ذخیره تنظیمات
                </Button>
              </div>
            </Form>
          </div>


          <BottomModal open={showInfoModal} onClose={() => setShowInfoModal(false)} >
            <StoreInfoForm onCancel={() => setShowInfoModal(false)} />
          </BottomModal>
        </div>
      </Col>
    </Row>


  )
}
