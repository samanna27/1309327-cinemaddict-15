const createSiteMenuItemTemplate = (filtersAndStats) => {
  const {name, count} = filtersAndStats;

  return (
    `<a href="#${name}" class="main-navigation__item"
    ${count === 0 ? 'disabled' : ''}
    >${name.toString()[0].toUpperCase()+name.toString().slice(1)} <span class="main-navigation__item-count">${count}</span></a>`
  );
};

const createSiteMenuTemplate = (filtersAndStats) => {
  const filterItemsTemplate = filtersAndStats.map((filter, index) => createSiteMenuItemTemplate(filter, index === 0)).slice(1).join('');

  return(
    `<a href="#All" class="main-navigation__item"
    ${filtersAndStats[0].count === 0 ? 'disabled' : ''}
    >All movies</a>
    ${filterItemsTemplate}
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
  );
};

const createStatsTemplate = (filtersAndStats) => {
  const {count} = filtersAndStats;

  return (
    `<p>${count} movies inside</p>`
  );
};

export {createSiteMenuTemplate, createStatsTemplate};

