import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { Modal, Form } from 'react-bootstrap';
import DatePicker, { registerLocale } from 'react-datepicker';
import { GoTrashcan } from 'react-icons/go';
import { MdEdit } from 'react-icons/md';
import { onlyUnique, sqlDateFormat } from '../../helpers';
import Button from '../button/Button';
import StyledForm from '../RegisterUser/StyledForm';
import { v4 as uuidv4 } from 'uuid';
import es from 'date-fns/locale/es';
import { putAxios } from '../../axiosCalls';
import { UserContext } from '../../context/UserContext';
import { useHistory } from 'react-router-dom';

registerLocale('es', es);

function AdminExperiencesItem({experience}) {

  const INITIAL_VALUES = {
    name: experience?.nombre,
    city: experience?.ciudad,
    category: experience?.categoria,
    price: experience?.precio,
    participants: experience?.num_participantes,
    sDate: experience?.fecha_inicio,
    fDate: experience?.fecha_fin,
    description: experience?.descripcion,
  }
  
  const history = useHistory();
  
  const [formActivate, setFormActivate] = useState(false);
  const [category,setCategory] = useState([]);
  const { token } = useContext(UserContext)
  const [editDataForm,setEditDataForm] = useState(INITIAL_VALUES);
  const [error,setError] = useState('');
  
  const optionsDate = {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  }

  const dateInit = new Date(editDataForm?.sDate).toLocaleDateString('es-ES',optionsDate);
  const dateFinal = new Date(editDataForm?.fDate).toLocaleDateString('es-ES',optionsDate);

  async function getCategories() {
    const { data } = await axios.get('http://localhost:8080/experiences');
    const categories = data.data.map((category) => category.categoria);
    const allCategories = categories.filter(onlyUnique);
    setCategory(allCategories);
  }

  useEffect(() => {
    getCategories();
  },[]);
  
  async function putEditInfo(e) {
    
    e.preventDefault();

    try {
      await putAxios(
        `http://localhost:8080/experiences/${experience.id}`,
        {...editDataForm,sDate: sqlDateFormat(dateInit),fDate: sqlDateFormat(dateFinal)}, 
        token
      );
      history.go(0);
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <tr className="sectionData">
      <td className='dataInfo'>
        <div>
          <h3>{experience?.nombre}</h3>
          <span>Ciudad: {experience?.ciudad}</span>
          <span>Categoría: {experience?.categoria}</span>
          <span>{experience?.num_participantes} {experience?.num_participantes === 1 ? 'persona' : 'personas'}</span>
          <div className='dataInfoRow'>
            <span>{dateInit}</span>
            <span>{dateFinal}</span>
          </div>
        </div>
        <span>{experience?.disp === 1 ? 'Disponible' : 'No disponible'}</span>
      </td>
      <td className="buttonsAdmin">
        <MdEdit onClick={() => setFormActivate(!formActivate)} />
        <Modal
          show={formActivate}
          onHide={() => setFormActivate(!formActivate)}
        >
          <StyledForm>
            <Modal.Header closeButton>
              <Modal.Title>Edita la experiencia</Modal.Title>
            </Modal.Header>
            <Form className='modalBody' onSubmit={putEditInfo}>
              <Form.Group className='formElement'>
                <Form.Label>
                  Nombre experiencia
                  <Form.Control 
                    type="text" 
                    placeholder={experience?.nombre}
                    onChange={(e) => setEditDataForm({...editDataForm,name: e.target.value})} 
                  />
                </Form.Label>
              </Form.Group>
              <Form.Group className='formElement'>
                <Form.Label>
                  Ubicación
                  <Form.Control 
                    type="text" 
                    placeholder={experience?.ciudad}
                    onChange={(e) => setEditDataForm({...editDataForm,city: e.target.value})} 
                  />
                </Form.Label>
              </Form.Group>
              <Form.Group className='formElement'>
                <Form.Label>
                  Categoria
                  <Form.Select value={editDataForm?.city} onChange={(e) => setEditDataForm({...editDataForm,category: e.target.value})}>
                    {category && category.map((category) => {
                      return (
                            <>
                              {experience.categoria === category ? 
                                <option key={uuidv4()} selected>{category}</option> 
                                : 
                                <option key={uuidv4()}>{category}</option>
                                }
                            </>
                    )})}
                  </Form.Select>
                </Form.Label>
              </Form.Group>
              <Form.Group className='formElement'>
                <Form.Label>
                  Precio
                  <Form.Control 
                    type="text" 
                    placeholder={experience?.precio + ' €'}
                    onChange={(e) => setEditDataForm({...editDataForm,price: e.target.value})} 
                  />
                </Form.Label>
              </Form.Group>
              <Form.Group className='formElement'>
                <Form.Label>
                  Nº Participantes
                  <Form.Control 
                    type="number" 
                    placeholder={experience?.num_participantes}
                    onChange={(e) => setEditDataForm({...editDataForm,participants: e.target.value})} 
                    />
                </Form.Label>
              </Form.Group>
              <Form.Group className='formElement'>
                <Form.Label>
                  Fecha de Inicio
                  <DatePicker 
                    locale="es"
                    dateFormat="dd/MM/yyyy"
                    className="date-picker"
                    selected={editDataForm.sDate}
                    onChange={(date) => setEditDataForm({...editDataForm,sDate: date})}
                  />
                </Form.Label>
              </Form.Group>
              <Form.Group className='formElement'>
                <Form.Label>
                  Fecha Fin
                  <DatePicker 
                    locale="es"
                    dateFormat="dd/MM/yyyy"
                    className="date-picker"
                    selected={editDataForm.fDate}
                    onChange={(date) => setEditDataForm({...editDataForm,fDate: date})}
                  />
                </Form.Label>
              </Form.Group>
              <Form.Group className='formElement'>
                <Form.Label>
                  Descripcion
                  <Form.Control 
                    as='textarea' 
                    style={{height: 100 + 'px'}} 
                    placeholder={experience?.descripcion}
                    onChange={(e) => setEditDataForm({...editDataForm,description: e.target.value})}
                  />
                </Form.Label>
              </Form.Group>
              <Form.Group className='formElement'>
                <Form.Label>
                  Imagen
                  <Form.Control type='file'/>
                </Form.Label>
              </Form.Group>
              <Form.Group className='formElement checkboxForm'>
                <Form.Check type="checkbox" />
                <Form.Label>Aceptar condiciones de uso</Form.Label>
              </Form.Group>
              {error && <p>{error}</p>}
              <Button white>ENVIAR</Button>
            </Form>
          </StyledForm>
        </Modal>

        <GoTrashcan />
      </td>
    </tr>
  );
}

export default AdminExperiencesItem;
