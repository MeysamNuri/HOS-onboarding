import {
    Row,

} from "antd";


const AjaxLoadingComponent = () => {


    return (
        <Row

            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '50vh',
                alignContent: 'center',

            }}>
            <div className="loader"></div>
        </Row>);
}

export default AjaxLoadingComponent;