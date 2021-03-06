import styled from 'styled-components';

const StyledFilters = styled.div`
  border: 3px solid var(--color-cyan);
  border-radius: 6px;
  width: 20%;

  & > div, & > ul {
    border-bottom: 2px solid var(--color-cyan);
  }

  & > ul {
    overflow-y: scroll;
    height: 300px;
  }

  & > div:last-child {
    border-bottom: 0;
  }

  .cityFilter li {
    padding: 1rem 1rem 0rem 1rem;
    color: var(--color-black);
    cursor: pointer;
  }

  .cityFilter li:last-child {
    padding-bottom: 1rem;
  }

  .priceFilter {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .priceFilter > label {
    padding: 1rem 1rem 0rem 1rem;
    display: flex;
    align-items: center;
    gap: 15px;
    color: var(--color-black);
  }

  .priceFilter > label:last-child {
    padding-bottom: 1rem;
  }

  .dateFilter {
    display: flex;
    flex-direction: column;
    padding: 1rem;
  }

  .dateFilter label {
    margin-bottom: 1.2rem;
  }

  .dateFilter span {
    display: block;
    margin-bottom: 0.3rem;
  }

  .dateFilter label:last-child {
    margin-bottom: 0rem;
  }

  .date-picker {
    border: 1px solid var(--color-cyan);
    border-radius: 6px;
    width: 100%;
    padding: 0.5rem;
  }
`;
  
export default StyledFilters;
