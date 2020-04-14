const createTravelCostTemplate = (totalCost) => {
  return (
    `<p class="trip-info__cost">
              Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalCost}</span>
    </p>`
  );
};

export {createTravelCostTemplate};
