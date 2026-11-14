import { Form, Input, Button, Typography, Radio, Spin } from "antd";
import { PlusOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { NumberConverter } from "@/core/helper/numberConverter";
import useModalForm from "./hooks/modalFormHook";
import './styles/chooseSerial.scss';
import type { OrderModalProps } from "../types/models";
import { convertToDomesticFormat } from "../helper/convertPhoneNumber";


const { Title, Text } = Typography;

const ChooseSerialModal: React.FC<OrderModalProps> = ({
  onCancel,
  isFromNavbar,
  packetCode,
  onSubmit,
  isSubmitting = false,

}) => {
  const {
    setShowInsertInput,
    form,
    showInsertInput,
    selectedSerial,
    submittable,
    frontSerials,
    userInfo,
    isLoadingSerials,
    handleSerialChange,
    handleFinish,

  } = useModalForm({ onCancel, packetCode, isFromNavbar, onSubmit });

  const serialList: string[] | undefined = frontSerials;

  // Determine which serials to show
  const displaySerials = serialList;
  const hasSerials = displaySerials && displaySerials.length > 0;
  const domesticNumber = convertToDomesticFormat(userInfo?.phoneNumber ?? "")
  const renderSerialRadioGroup = () => (
    <Radio.Group disabled={showInsertInput} vertical onChange={handleSerialChange} value={selectedSerial}>

      {displaySerials?.map((s: string) => (
        <Radio key={s} value={s}>
          {NumberConverter.latinToArabic(s)}
        </Radio>
      ))}
    </Radio.Group>
  );

  return (
    <div className="order-modal">

      {
        !isFromNavbar &&
        <div className="modal-title">
          <Title level={5}>انتخاب سریال</Title>

          <Text
            className="default-phoneNumber"
            onClick={() => setShowInsertInput((prev) => !prev)}
            style={{ cursor: "pointer" }}
          >
            <PlusOutlined style={{ marginLeft: 10 }} />
            وارد کردن سریال
          </Text>

        </div>
      }

      {
        isFromNavbar ?
          <Text type="secondary" className="modal-subtitle">
            لطفا سریال مورد نظر را انتخاب نمایید
          </Text> :

          <Text type="secondary" className="modal-subtitle">
            برای ادامه شماره سریال هلو خود را انتخاب یا وارد کنید
          </Text>
      }


      <div className="show-mobile-Box">
        <Text>شماره موبایل</Text>
        <Text style={{ direction: "ltr" }}>
          {NumberConverter.latinToArabic(
            domesticNumber || ""
          )}
        </Text>
      </div>

      <Form form={form} layout="vertical" onFinish={handleFinish} requiredMark={false}>
        {/* Optional manual serial input */}
        {showInsertInput && (
          <Form.Item
            label="شماره سریال نرم افزار هلو"
            name="serial"
            rules={[
              { required: true, message: "وارد کردن شماره سریال الزامی می باشد" },
              { pattern: /^\d+$/, message: "فقط عدد وارد کنید" },
              {
                pattern: /^(\d{6}|\d{8})$/,
                message: "شماره سریال باید دقیقا 6 یا 8 رقم باشد",
              },
              {
                validator: (_, value) => {
                  if (value && /^0+$/.test(value)) {
                    return Promise.reject(
                      "شماره سریال نمی‌تواند تنها از صفر تشکیل شده باشد"
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input
              placeholder="مثال: 123456"
              size="large"
              className="insert-serial"
              suffix={
                <CloseCircleOutlined
                  style={{ color: "rgba(0,0,0,.45)" }}
                  onClick={() => setShowInsertInput((prev) => !prev)}
                />
              }
            />
          </Form.Item>
        )}

        {/* Existing serials */}
        <div className="serials-list">

          {
            isLoadingSerials ? <Spin /> :
              displaySerials && displaySerials.length > 0 && !showInsertInput && (
                renderSerialRadioGroup()
              )}

          {!hasSerials && !showInsertInput && !isLoadingSerials && (
            <Text style={{ color: "red" }}>
              شماره سریالی برای شما موجود نیست
            </Text>
          )}
        </div>
        <br />
        <div className="button-container">
          <Button
            htmlType="submit"
            size="middle"
            block
            loading={isSubmitting}
            className={!selectedSerial && !submittable ? "" : "buttons-styles"}
            disabled={isSubmitting || (!selectedSerial && !submittable)}
          >
            تأیید و ادامه
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ChooseSerialModal;
