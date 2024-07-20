import React from 'react';

function FollowedCompanies({ companies }) {
  return (
    <div className="followed-companies">
      <h2>Followed Companies</h2>
      {/* {companies.map((company, index) => (
        <div key={index}> */}
        {companies.map((company) => (
        <div key={company.id}>
          <h3>{company.name}</h3>
        </div>
      ))}
    </div>
  );
}

export default FollowedCompanies;