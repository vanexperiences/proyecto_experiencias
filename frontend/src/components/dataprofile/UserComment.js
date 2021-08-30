import { Modal, Form } from 'react-bootstrap';
import { useContext, useState } from 'react';
import Button from '../button/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import StyledForm from '../RegisterUser/StyledForm';
import { putAxios } from '../../axiosCalls';
import { UserContext } from '../../context/UserContext';

function UserComment({ idBooking }) {
  const [formActivate, setFormActivate] = useState(false);
  const { token } = useContext(UserContext);
  const [comment, setComment] = useState('');
  const [error, setError] = useState();

  async function addComment(e) {
    try {
      e.preventDefault();

      const body = {
        comment,
      };

      await putAxios(
        `http://localhost:8080/bookings/${idBooking}/comments`,
        body,
        token
      );
      setFormActivate(!formActivate);
    } catch (error) {
      setError(error.response.data.message);
    }
  }

  return (
    <>
      <Button blue onClickButton={() => setFormActivate(!formActivate)}>
        AÑADIR COMENTARIO
      </Button>

      <Modal show={formActivate} onHide={() => setFormActivate(!formActivate)}>
        <StyledForm>
          <Modal.Header closeButton>
            <Modal.Title>COMENTA TU EXPERIENCIA</Modal.Title>
          </Modal.Header>
          <Form className="modalBody" onSubmit={addComment}>
            <Form.Group className="formElement">
              <Form.Label>
                <span>Comentario</span>
                <Form.Control
                  as="textarea"
                  placeholder="Añade tu comentario"
                  style={{ height: '150px' }}
                  onChange={(e) => setComment(e.target.value)}
                />
              </Form.Label>
            </Form.Group>
            {error && <div className="errorForm">{error}</div>}
            <Button white>Añadir Comentario</Button>
          </Form>
        </StyledForm>
      </Modal>
    </>
  );
}

export default UserComment;
