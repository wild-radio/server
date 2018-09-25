import { transaction } from '../../database/db';

export const getCatalogos = async (req, res) => {
  const catalogos = await transaction.getResultList('select * from Catalogo');

  res.status(200).send(catalogos);
};

export const postCatalogos = async (req, res) => {
  const { body } = req;
  const { nome } = body;

  if (!nome) {
    return res.status(400).send('Campos obrigatórios devem ser preenchidos');
  }

  await transaction.execute(`insert into Catalogo (nome) values ('${nome}')`);
  const cadastrado = await transaction.getFirstResult('select * from Catalogo order by id desc');

  res.status(200).send(cadastrado);
};

export const putCatalogos = async (req, res) => {
  const { idCatalogo } = req.params;
  const { body } = req;
  const { nome } = body;

  if (!nome) {
    return res.status(400).send('Campos obrigatórios devem ser preenchidos');
  }

  const catalogo = await transaction.getFirstResult(
    `select * from Catalogo where id = ${idCatalogo}`,
  );

  if (!catalogo) {
    return res.status(404).send('Catálogo não encontrado');
  }

  await transaction.execute(`update Catalogo set nome = '${nome}' where id = ${idCatalogo}`);

  res.status(200).send({ ...catalogo, nome });
};

export const deleteCatalogos = async (req, res) => {
  const { idCatalogo } = req.params;

  const catalogo = await transaction.getSingleColumn(
    `select count(*) from Catalogo where id = ${idCatalogo}`,
  );

  if (!catalogo) {
    return res.status(404).send('Catálogo não encontrado');
  }

  await transaction.execute(`delete from Catalogo where id = ${idCatalogo}`);

  res.status(200).send();
};

export const getFotos = async (req, res) => {
  const { idCatalogo } = req.params;

  const catalogo = await transaction.getSingleColumn(
    `select count(*) from Catalogo where id = ${idCatalogo}`,
  );

  if (!catalogo) {
    return res.status(404).send('Catálogo não encontrado');
  }

  const fotos = await transaction.getResultList(
    `select * from Foto where idCatalogo = ${idCatalogo}`,
  );

  res.status(200).send(fotos);
};

export const putFotos = async (req, res) => {
  const { idCatalogo, idFoto } = req.params;

  const catalogo = await transaction.getSingleColumn(
    `select count(*) from Catalogo where id = ${idCatalogo}`,
  );

  if (!catalogo) {
    return res.status(404).send('Catálogo não encontrado');
  }

  const foto = await transaction.getSingleColumn(`select count(*) from Foto where id = ${idFoto}`);

  if (!foto) {
    return res.status(404).send('Foto não encontrada');
  }

  await transaction.execute(`update Foto set idCatalogo = ${idCatalogo} where id = ${idFoto}`);

  res.status(200).send();
};

export const deleteFotos = async (req, res) => {
  const { idCatalogo, idFoto } = req.params;

  const catalogo = await transaction.getSingleColumn(
    `select count(*) from Catalogo where id = ${idCatalogo}`,
  );

  if (!catalogo) {
    return res.status(404).send('Catálogo não encontrado');
  }

  const foto = await transaction.getSingleColumn(
    `select count(*) from Foto where id = ${idFoto} and idCatalogo = ${idCatalogo}`,
  );

  if (!foto) {
    return res.status(404).send('Foto não encontrada neste catálogo');
  }

  await transaction.execute(`delete from Foto where id = ${idFoto} and idCatalogo = ${idCatalogo}`);

  res.status(200).send();
};

export const putTransferirFotos = async (req, res) => {
  const { idCatalogoOrigem, idCatalogoDestino } = req.params;

  const catalogoOrigem = await transaction.getSingleColumn(
    `select count(*) from Catalogo where id = ${idCatalogoOrigem}`,
  );

  if (!catalogoOrigem) {
    return res.status(404).send('Catálogo de origem não encontrado');
  }

  const catalogoDestino = await transaction.getSingleColumn(
    `select count(*) from Catalogo where id = ${idCatalogoDestino}`,
  );

  if (!catalogoDestino) {
    return res.status(404).send('Catálogo de destino não encontrado');
  }

  await transaction.execute(
    `update Foto set idCatalogo = ${idCatalogoDestino} where idCatalogo = ${idCatalogoOrigem}`,
  );

  res.status(200).send();
};
