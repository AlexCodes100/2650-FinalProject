import React from 'react';

function RecommendedCompanies({ companies }) {
  return (
    <div className="recommended-companies">
      <h2>Recommended Companies</h2>
      {/* {companies.map((company, index) => (
        <div key={index}> */}
        {companies.map((company) => (
        <div key={company.id}>
          <h3>{company.name}</h3>
          <p>{company.description}</p>
        {/* add more user information if need it  */}
        </div>
      ))}
    </div>
  );
}

export default RecommendedCompanies;