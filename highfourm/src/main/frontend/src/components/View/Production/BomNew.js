import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Form, Popconfirm, Select } from 'antd';
import { InputBar, BtnBlue, BtnWhite, BtnBlack } from '../../Common/Module';
import BasicTable from '../../Common/Table/BasicTable';

const BomNew = ({  onSubmit, onSubmitSuccess }) => {
  const [timeOptions, setTimeOptions] = useState("");
  const [count, setCount] = useState(0);
  const [dataProcess, setDataProcess] = useState([]);
  const [dataRequiredMaterial, setDataRequiredMaterial] = useState([]);

  const formRef = useRef(null);

  const selectTimeOptions = (value) => {
    setTimeOptions(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Get form data
    const formData = new FormData(document.getElementById('bomNewForm'));

    const jsonData = {};
    formData.forEach((value, key) => {
      jsonData[key] = value;
    });

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;
    // 예제: BomRequestDTO와 일치하도록 구성
    const bomRequest = {
      productId: jsonData.productId,
      productName: jsonData.productName,
      writeDate: formattedDate, //현재시간을 문자열로 바꾼 값
      updateDate: formattedDate, //현재시간을 문자열로 바꾼 값
      processId: jsonData.processId,
      sequence: parseInt(jsonData.sequence),
      processName: jsonData.processName,
      timeUnit: jsonData.timeUnit,
      standardWorkTime: parseInt(jsonData.standardWorkTime),
      outputUnit: jsonData.outputUnit,
      materialId: jsonData.materialId,
      inputProcess: jsonData.inputProcess,
      inputAmount: parseInt(jsonData.inputAmount),
    };

    // Send POST request using Axios
    axios.post('/api/bom/new', JSON.stringify(bomRequest),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(response => {
        // Handle successful response
        console.log('bom data added successfully');
        // Redirect user to another page if needed
      })
      .catch(error => {
        // Handle errors
        console.log(jsonData)
        console.error('Error adding material:', error);
      });

    if (onSubmit) {
      onSubmit();
      // 폼이 성공적으로 제출되면 콜백을 호출합니다.
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    }
  };

  const timeUnitOptions = [
    { value: 'sec', label: 'sec' },
    { value: 'min', label: 'min' },
    { value: 'hour', label: 'hour' },
  ];

  const handleDeleteProcess = (key) => {
    setDataProcess((prevState) => prevState.filter((item) => item.key !== key));
  }

  const handleAddProcess = () => {
    const newData = {
      key: count,
    };
    setDataProcess(prevState => [ ...prevState, newData ]);
    setCount(count + 1);
  };

  const handleDeleteRequiredMaterial = (key) => {
    setDataRequiredMaterial((prevState) => prevState.filter((item) => item.key !== key));
  }

  const handleAddRequiredMaterial = () => {
    const newData = {
      key: count,
    };
    setDataRequiredMaterial(prevState => [ ...prevState, newData ]);
    setCount(count + 1);
  };

  const defaultColumnsProcess = [
    {
      title: '공정 코드',
      dataIndex: 'processId',
      editable: true,
    },
    {
      title: '공정 순서',
      dataIndex: 'sequence',
      editable: true,
    },
    {
      title: '공정명',
      dataIndex: 'processName',
      editable: true,
    },
    {
      title: '시간 단위',
      dataIndex: 'timeUnit',
      render: () => (
        <Form.Item name='timeUnit' style={{ margin: 0 }}>
          <Select
            name={'timeUnit'}
            defaultValue="시간 단위"
            variant='borderless'
            onChange={selectTimeOptions}
            options={timeUnitOptions}
            allowClear={false}
            required
          />
          <InputBar type='hidden' name={'timeUnit'} value={timeOptions} />
        </Form.Item>
        ),
    },
    {
      title: '표준 작업 시간',
      dataIndex: 'standardWorkTime',
      editable: true,
    },
    {
      title: '산출물 단위',
      dataIndex: 'outputUnit',
      editable: true,
    },
    {
      title: '삭제',
      dataIndex: 'operation',
      render: (_, record) =>
        dataProcess.length >= 1 ? (
          <Popconfirm title="정말 삭제하시겠습니까?" onConfirm={() => handleDeleteProcess(record.key)}>
            <a>삭제</a>
          </Popconfirm>
        ) : null,
    },
  ];

  const defaultColumnsRequiredMaterial = [
    {
      title: '원자재 코드',
      dataIndex: 'materialId',
      editable: true,
    },
    {
      title: '투입 공정',
      dataIndex: 'inputProcess',
      editable: true,
    },
    {
      title: '투입량',
      dataIndex: 'inputAmount',
      editable: true,
    },
    {
      title: '삭제',
      dataIndex: 'operation',
      render: (_, record) =>
        dataRequiredMaterial.length >= 1 ? (
          <Popconfirm title="정말 삭제하시겠습니까?" onConfirm={() => handleDeleteRequiredMaterial(record.key)}>
            <a>삭제</a>
          </Popconfirm>
        ) : null,
    },
  ];

  return (
    <>
      <form id='bomNewForm' method='post' ref={formRef}  style={{ borderTop: '1px solid #ccc' }} onSubmit={handleSubmit}>
        <div>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          <div className='bordered-box-title' style={{ width:'100%', margin:'24px 0 12px',flexWrap: 'wrap' }}>
            <h3 className='bordered-box-title'>제품</h3>
          </div>
            <div className='modal-div' >
              <label htmlFor='productId' className='label-title'>제품 코드:</label>
              <InputBar inputId={'productId'} name={'productId'} id={'productId'} required/>
            </div>
            <div className='modal-div' style={{ marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
              <label htmlFor='productName' className='label-title'>제품명:</label>
              <InputBar inputId={'productName'} name={'productName'} id={'productName'} required/>
            </div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          <div className='bordered-box-title' style={{ width:'100%', margin:'24px 0 12px',flexWrap: 'wrap' }}>
            <h3 className='bordered-box-title'>공정</h3>
          </div>
            {/* <div className='modal-div' style={{ marginBottom: '15px' }}>
              <label htmlFor='processId' className='label-title'>공정 코드:</label>
              <InputBar inputId={'processId'} name={'processId'} id={'processId'} required/>
            </div>
            <div className='modal-div' style={{ marginBottom: '15px' }}>
              <label htmlFor='sequence' className='label-title'>공정 순서:</label>
              <InputBar inputId={'sequence'} name={'sequence'} id={'sequence'} required/>
            </div>
            <div className='modal-div' style={{ marginBottom: '15px' }}>
              <label htmlFor='processName' className='label-title'>공정명:</label>
              <InputBar inputId={'processName'} name={'processName'} id={'processName'} required/>
            </div>
            <div className='modal-div' style={{ marginBottom: '15px' }}>
              <label htmlFor='timeUnit' className='label-title'>시간 단위:</label>
              <Select
                name={'timeUnit'}
                defaultValue="시간 단위"
                style={{
                  width: '200px',
                  height: '40px'
                }}
                onChange={selectTimeOptions}
                options={timeUnitOptions}
                allowClear={false}
                required
              />
              <InputBar type='hidden' name={'timeUnit'} value={timeOptions} />
            </div>
            <div className='modal-div' style={{ marginBottom: '15px' }}>
              <label htmlFor='standardWorkTime' className='label-title'>표준 작업 시간:</label>
              <InputBar inputId={'standardWorkTime'} name={'standardWorkTime'} id={'standardWorkTime'} required/>
            </div>
            <div className='modal-div' style={{ marginBottom: '15px' }}>
              <label htmlFor='outputUnit' className='label-title'>산출물 단위:</label>
              <InputBar inputId={'outputUnit'} name={'outputUnit'} id={'outputUnit'} required/>
            </div> */}
            <div style={{width:'100%', marginBottom: '15px'}}>
              <BasicTable
              dataSource={dataProcess} 
              defaultColumns={defaultColumnsProcess} 
              setDataSource={setDataProcess} 
              pagination={false}/>
            </div>
            <div className='add-btn'>
              <BtnBlack value={"항목 추가"} onClick={handleAddProcess}></BtnBlack>
            </div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          <div className='bordered-box-title' style={{ width:'100%', margin:'24px 0 12px',flexWrap: 'wrap' }}>
            <h3 className='bordered-box-title'>소요 자재</h3>
          </div>
            {/* <div className='modal-div' >
              <label htmlFor='materialId' className='label-title'>원자재 코드:</label>
              <InputBar inputId={'materialId'} name={'materialId'} id={'materialId'} required/>
            </div>
            <div className='modal-div' style={{ marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
              <label htmlFor='inputProcess' className='label-title'>투입 공정:</label>
              <InputBar inputId={'inputProcess'} name={'inputProcess'} id={'inputProcess'} required/>
            </div>
            <div className='modal-div' style={{ marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
              <label htmlFor='inputAmount' className='label-title'>투입량:</label>
              <InputBar inputId={'inputAmount'} name={'inputAmount'} id={'inputAmount'} required/>
            </div> */}
            <div style={{width:'100%', marginBottom: '15px'}}>
              <BasicTable
              dataSource={dataRequiredMaterial} 
              defaultColumns={defaultColumnsRequiredMaterial} 
              setDataSource={setDataRequiredMaterial} 
              pagination={false}/>
            </div>
            <div className='add-btn'>
              <BtnBlack value={"항목 추가"} onClick={handleAddRequiredMaterial}></BtnBlack>
            </div>
          </div>
        </div>
        <div style={{display:'flex', justifyContent:'flex-end', marginTop:'12px'}}>
          <BtnBlue value={'저장'} type={'submit'}/>
        </div>
      </form>
    </>
  );
};
export default BomNew;