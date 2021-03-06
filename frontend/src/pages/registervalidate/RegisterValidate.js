import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ValidateRegister from '../../components/validateRegister/ValidateRegister';

function RegisterValidate() {
  const [userDataName, setUserDataName] = useState();
  const [userDataEmail, setUserDataEmail] = useState();

  const location = useLocation();

  useEffect(() => {
    setUserDataName(location.username);
    setUserDataEmail(location.email);
  }, [location]);

  return (
    <>
      {userDataEmail && (
        <ValidateRegister email={userDataEmail} name={userDataName} />
      )}
    </>
  );
}
export default RegisterValidate;
