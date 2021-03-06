import styled from 'styled-components';

const StyledAdminProfile = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 1200px;
  margin: 4rem auto;

  .adminProfileHead h2 {
    font-size: 3rem;
  }

  .adminProfileNav {
    width: 100%;
  }

  .adminProfileNav ul {
    display: flex;
    justify-content: space-between;
  }

  .adminProfileNav li {
    padding: 2rem 8rem;
    cursor: pointer;
  }

  .dataActive {
    background-color: var(--color-cyan);
    color: var(--color-white);
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
  }

  .tableData {
    width: 100%;
    border: 3px solid var(--color-cyan);
  }

  .sectionData {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2rem;
    width: 100%;
    border-bottom: 3px solid var(--color-cyan);

    & .dataInfo {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 80%;
    }

    & .dataInfo > ul {
      display: flex;
      flex-direction: column;

      li {
        margin-bottom: 0.5rem;
      }

      .avaliable {
        display: flex;
        align-items: center;
        gap: 0.5rem;

        span {
          margin-left: 0px;
        }
      }
    }

    & .dataInfoRow {
      display: flex;
      gap: 1rem;

      span {
        margin-left: 0px;
      }
    }
  }

  .sectionData:nth-child(odd) {
    background-color: var(--color-white-ghost);
  }

  .sectionData:nth-child(even) {
    background-color: var(--color-cyan-light);
  }

  .sectionData:last-child {
    border-bottom: 0px;
  }

  .buttonsAdmin {
    display: flex;
    gap: 20px;
    font-size: 40px;
    color: var(--color-cyan);
    cursor: pointer;
  }

  .sectionData td h3 {
    color: var(--color-black);
  }
  .sectionData td span {
    color: var(--color-black);
    margin-left: 10px;
  }
`;

export default StyledAdminProfile;
