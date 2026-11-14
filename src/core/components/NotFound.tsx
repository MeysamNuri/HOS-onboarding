import { Result, Button } from 'antd';
import { useNavigate } from 'react-router';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Result
    style={{marginTop:"8rem"}}
      status="404"
      title="404"
      subTitle="متأسفیم، صفحه مورد نظر شما پیدا نشد"
      extra={
        <Button  className="buttons-styles" type="primary" onClick={() => navigate('/')}>
         برگشت به صفحه اصلی
        </Button>
      }
    />
  );
}
