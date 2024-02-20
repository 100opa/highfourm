import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Modal } from 'antd';
import BasicTable from '../../Common/Table/BasicTable';
import { BtnBlack, BtnBlue, SearchInput, SearchSelectBox } from '../../Common/Module';
import PageTitle from '../../Common/PageTitle';
import axios from 'axios';
import downloadXlsx from '../../Common/DownloadXlsx';
import KeyTable from '../../Common/Table/KeyTable';
import BomNew from './BomNew';

function Bom() {
  const navigate = useNavigate();
  const location = useLocation();
  const { productId } = useParams();
  const [dataProduct, setDataProduct] = useState([]);
  const [dataProcess, setDataProcess] = useState([]);
  const [dataMaterial, setDataMaterial] = useState([]);
  const [dataRequiredMaterial, setDataRequiredMaterial] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchType, setSearchType] = useState('제품 코드');
  const currentURL = window.location.pathname;

  useEffect(() => {
    async function fetchData() {
      try {
        let res;

        if (currentURL === '/bom/search') {
          const searchParams = new URLSearchParams(location.search);
          const searchTypeParam = searchParams.get('searchType');
          const searchValueParam = searchParams.get('search');

          res = await axios.get('/api/bom/search', {
            params: {
              searchType: searchTypeParam,
              search: searchValueParam,
            },
          });
        } else {
          res = await axios.get('/api/bom');
        }
        if (res) {
          const newDataProduct = await res.data["product"].map((item, index) => ({ key: index, ...item }));
          setDataProduct(newDataProduct);
          // const newDataMaterial = await res.data["material"].map((item, index) => ({ key: index, ...item }));
          // setDataMaterial(newDataMaterial);
        } 
      } catch (error) {
        console.error('데이터를 가져오는 중 오류 발생:', error);
      }
    };
  
    fetchData();
  }, [currentURL, location.search]);

  const defaultColumnsProduct = [
    {
      title: '제품 코드',
      dataIndex: 'productId',
    },
    {
      title: '제품명',
      dataIndex: 'productName',
    },
    {
      title: '작성일',
      dataIndex: 'writeDate',
    },
    {
      title: '수정일',
      dataIndex: 'updateDate',
    },
  ];

  const defaultColumnsProcess = [
    {
      title: '공정 코드',
      dataIndex: 'processId',
    },
    {
      title: '공정 순서',
      dataIndex: 'sequence',
    },
    {
      title: '공정명',
      dataIndex: 'processName',
    },
    {
      title: '시간 단위',
      dataIndex: 'timeUnit',
    },
    {
      title: '표준 작업 시간',
      dataIndex: 'standardWorkTime',
    },
    {
      title: '산출물 단위',
      dataIndex: 'outputUnit',
    },
  ];

  const defaultColumnsRequiredMaterial = [
    {
      title: '원자재 코드',
      dataIndex: 'materialId',
    },
    {
      title: '투입 공정',
      dataIndex: 'inputProcess',
    },
    {
      title: '자재명',
      dataIndex: 'materialName',
    },
    {
      title: '투입량',
      dataIndex: 'inputAmount',
    },
  ];

  const SelectChangeHandler = (value) => {
    setSearchType(value);
  };

  const onSearch = (value) => {
    navigate(`/bom/search?searchType=${encodeURIComponent(searchType)}&search=${encodeURIComponent(value)}`);
  }

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleBomNewSubmit = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className='bom-page'>
      <PageTitle value={'제품별 공정/소요자재 관리'}/>
      <h3 style={{marginBottom:'12px'}}>제품 검색</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 24px', alignItems: 'center' }}>
          <SearchSelectBox selectValue={['제품 코드', '제품명']} SelectChangeHandler={SelectChangeHandler} />
          <SearchInput id={'search'} name={'search'} onSearch={onSearch} />
        </div>
        <BtnBlue value={'엑셀 저장'} onClick={() => { downloadXlsx(dataProduct, ['제품 코드', '제품명', '작성일', '수정일'], 'Product1', 'Product.xlsx') }} />
      </div>
      <div className='add-btn'>
        <BtnBlack value={"항목 추가"} onClick={showModal} />
        <Modal
          title='제품별 공정/소요자재 등록'
          open={isModalOpen}
          footer={null}
          onCancel={handleCancel}
          width='50%'
        >
          <BomNew onSubmit={handleBomNewSubmit} />
        </Modal>
      </div>
      <div style={{ display: 'flex', gap: '24px 19px' }}>
        <div className='table-box'>
          <KeyTable 
          dataSource={dataProduct} 
          defaultColumns={defaultColumnsProduct} 
          setDataSource={setDataProduct}
          pagination={false}
          url="bom/detail"
          keyName="productId"
          />
        </div>
        <div className='bordered-box'>
          <div className='bordered-box-title' style={{ flexWrap: 'wrap' }}>
            <h3 className='bordered-box-title'>공정 조회/설정</h3>
            <hr className='box-title-line' />
          </div>
          <div style={{ minHeight: '240px' }}>
            <BasicTable 
            dataSource={dataProcess} 
            defaultColumns={defaultColumnsProcess} 
            setDataSource={setDataProcess} 
            pagination={false}
            />
          </div>
          <div className='bordered-box-title' style={{ marginTop:'40px',flexWrap: 'wrap' }}>
            <h3 className='bordered-box-title'>소요자재 조회/설정</h3>
            <hr className='box-title-line' />
          </div>
          <div style={{ minHeight: '240px' }}>
            <BasicTable 
            dataSource={dataRequiredMaterial} 
            defaultColumns={defaultColumnsRequiredMaterial} 
            setDataSource={setDataRequiredMaterial} 
            pagination={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Bom