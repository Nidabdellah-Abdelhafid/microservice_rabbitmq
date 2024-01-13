import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { FaArrowLeft, FaArrowRight, FaSearch } from 'react-icons/fa';
import { Modal,Input, ModalHeader, ModalBody } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import AddVoiture from './AddVoiture';

const VoitureList = () => {
  const [clients, setClients] = useState([]);
  const [voitures, setVoitures] = useState([]);
  const [clientVoitures, setClientVoitures] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const clientsPerPage = 5;
  const pagesVisited = pageNumber * clientsPerPage;
  const navigate = useNavigate();
  useEffect(() => {
    axios.get('http://localhost:8089/voitures')
      .then(response => setVoitures(response.data))
      .catch(error => console.error('Error fetching clients', error));
  }, []);

  const displayClients=voitures
    .filter(voiture => voiture.matricule.toLowerCase().includes(searchTerm.toLowerCase()))
    .slice(pagesVisited, pagesVisited + clientsPerPage)
    .map(voiture => (
      <tr key={voiture.id}>
        <th scope="row">{voiture.id}</th>
        <td>{voiture.marque}</td>
        <td>{voiture.matricule}</td>
        <td>{voiture.model}</td>
        <td>{voiture.client.nom}</td>
        <td><Link to={`/edit-client/${voiture.id}`} className="btn btn-warning">Edit</Link></td>
        <td><button className="btn btn-danger" onClick={() => handleDeleteVoiture(voiture.id)}> Delete</button></td>
      </tr>
    ));

  const pageCount = Math.ceil(voitures.length / clientsPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const handleDeleteVoiture = (id) => {
    axios.delete(`http://localhost:8089/voitures/${id}`)
      .then(response => {
        console.log('Client deleted successfully', response);
        // Refresh the client list after deletion
        setVoitures(voitures.filter(voiture => voiture.id !== id));
      })
      .catch(error => console.error('Error deleting client', error));
  };
  const modalItemsPerPage = 5;
  const [showVoituresModal, setShowVoituresModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalPageNumber, setModalPageNumber] = useState(0);
  const [searchTermV, setSearchTermV] = useState('');

  const handleGetVoiture = (id) => {
    axios.get(`http://localhost:8088/client/voitures/${id}`)
      .then(response => {
        setClientVoitures(response.data);
        setShowVoituresModal(true);
      })
      .catch(error => console.error('Error fetching clients', error));
  };
  const addClient=()=>{
    setShowAddModal(true);
}

  const handleCloseModal = () => {
    setShowVoituresModal(false);
  };
  const handleCloseAddModal = () => {
    setShowAddModal(false);
  };

  const renderVoituresTable = () => {
    // Filter voitures based on search term
    const filteredVoitures = clientVoitures.filter(voiture =>
      voiture.marque.toLowerCase().includes(searchTermV.toLowerCase()) ||
      voiture.matricule.toLowerCase().includes(searchTermV.toLowerCase()) ||
      voiture.model.toLowerCase().includes(searchTermV.toLowerCase())
    );

    const modalPagesVisited = modalPageNumber * modalItemsPerPage;

    const displayVoitures = filteredVoitures
      .slice(modalPagesVisited, modalPagesVisited + modalItemsPerPage)
      .map(voiture => (
        <tr key={voiture.id}>
          <td>{voiture.id}</td>
          <td>{voiture.marque}</td>
          <td>{voiture.matricule}</td>
          <td>{voiture.model}</td>

        </tr>
      ));

    const modalPageCount = Math.ceil(filteredVoitures.length / modalItemsPerPage);

    const handleModalPageChange = ({ selected }) => {
      setModalPageNumber(selected);
    };

    return (
        <Modal isOpen={showVoituresModal} toggle={handleCloseModal} className="lg">
        <ModalHeader toggle={handleCloseModal}>Voitures</ModalHeader>
        <ModalBody>
          <div className="input-group mb-3">
          <span className="input-group-text"><FaSearch /></span>
            <Input
              type="text"
              className="form-control"
              placeholder="Search by marque, matricule, or model"
              value={searchTermV}
              onChange={(e) => setSearchTermV(e.target.value)}
            />
          </div>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Marque</th>
                <th scope="col">Matricule</th>
                <th scope="col">Model</th>
                
              </tr>
            </thead>
            <tbody>
              {displayVoitures}
            </tbody>
          </table>
          <div className="d-flex justify-content-center">
          <ReactPaginate
            previousLabel={<FaArrowLeft />}
            nextLabel={<FaArrowRight />}
            pageCount={modalPageCount}
            onPageChange={handleModalPageChange}
            containerClassName={'pagination'}
            previousLinkClassName={'pagination__link'}
            nextLinkClassName={'pagination__link'}
            disabledClassName={'pagination__link--disabled'}
            activeClassName={'pagination__link--active'}
          />
          </div>
        </ModalBody>
      </Modal>

    );
  };


  return (
    <div>
    <Modal isOpen={showAddModal} toggle={handleCloseAddModal} className="lg">
        <ModalHeader toggle={handleCloseAddModal}>Add Voiture</ModalHeader>
        <ModalBody>
        <AddVoiture />
        </ModalBody>
      </Modal>

      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand" to="/client-list">Microservice App</Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" to="/client-list">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/client-list">Client List</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/voiture-list">Voiture List</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="container mt-5">
      <div className="d-flex justify-content-between mb-3">
        <h2>Voiture List</h2>
        <button className="btn btn-info" onClick={() => addClient()}>Add New Voiture</button>
      </div>

      <div className="input-group mb-3">
        <span className="input-group-text"><FaSearch /></span>
        <input
          type="text"
          className="form-control"
          placeholder="Search by username"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <table className="table">
        <thead>
          <tr>
            <th scope="col">Id</th>
            <th scope="col">Marque</th>
            <th scope="col">Matricule</th>
            <th scope="col">Model</th>
            <th scope="col">Client</th>
            <th scope="col">Edit</th>
            <th scope="col">Delete</th>
          </tr>
        </thead>
        <tbody>{displayClients}</tbody>
      </table>

      <div className="d-flex justify-content-center">
        <ReactPaginate
          previousLabel={<FaArrowLeft />}
          nextLabel={<FaArrowRight />}
          pageCount={pageCount}
          onPageChange={changePage}
          containerClassName={'pagination'}
          previousLinkClassName={'pagination__link'}
          nextLinkClassName={'pagination__link'}
          disabledClassName={'pagination__link--disabled'}
          activeClassName={'pagination__link--active'}
        />
      </div>
      {renderVoituresTable()}
       </div>
    </div>
  );
};

export default VoitureList;
