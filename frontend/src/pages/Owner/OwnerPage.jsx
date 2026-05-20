import { useEffect, useState } from 'react';
import { ownersService } from '../../services/resourcesService';
import './owner.css';

const emptyForm = {
    name: '',
    document: '',
    phone: '',
    email: '',
    address: '',
};

export default function OwnersPage() {
    const [owners, setOwners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [form, setForm] = useState(emptyForm);
    const [editingOwner, setEditingOwner] = useState(null);
    const [detailOwner, setDetailOwner] = useState(null);
    const [message, setMessage] = useState('');

    async function loadOwners() {
        try {
            setLoading(true);

            const data = await ownersService.list();

            setOwners(data);
        } catch (error) {
            setMessage('Erro ao carregar donos.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadOwners();
    }, []);

    function handleChange(event) {
        const { name, value } = event.target;

        setForm({
            ...form,
            [name]: value,
        });
    }

    function clearForm() {
        setForm(emptyForm);
        setEditingOwner(null);
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (
            !form.name ||
            !form.document ||
            !form.phone ||
            !form.email ||
            !form.address
        ) {
            setMessage('Preencha todos os campos.');
            return;
        }

        if (!form.email.includes('@')) {
            setMessage('Informe um e-mail válido contendo "@".');
            return;
        }

        try {
            if (editingOwner) {
                await ownersService.update(editingOwner.id, form);
                setMessage('Dono atualizado com sucesso.');
            } else {
                await ownersService.create(form);
                setMessage('Dono cadastrado com sucesso.');
            }

            clearForm();
            loadOwners();
        } catch (error) {
            setMessage('Erro ao salvar dono.');
        }
    }

    function handleEdit(owner) {
        setEditingOwner(owner);

        setForm({
            name: owner.name || '',
            document: owner.document || '',
            phone: owner.phone || '',
            email: owner.email || '',
            address: owner.address || '',
        });
    }

    async function handleDetails(owner) {
        try {
            const data = await ownersService.getById(owner.id);
            setDetailOwner(data);
        } catch (error) {
            setMessage('Erro ao carregar detalhes.');
        }
    }

    async function handleDelete(owner) {
        const confirmDelete = window.confirm(`Deseja excluir ${owner.name}?`);

        if (!confirmDelete) return;

        try {
            await ownersService.remove(owner.id);
            setMessage('Dono excluído com sucesso.');
            loadOwners();
        } catch (error) {
            setMessage('Erro ao excluir dono.');
        }
    }

    const filteredOwners = owners.filter((owner) => {
        const term = search.toLowerCase();

        return (
            owner.name?.toLowerCase().includes(term) ||
            owner.document?.toLowerCase().includes(term) ||
            owner.phone?.toLowerCase().includes(term) ||
            owner.email?.toLowerCase().includes(term) ||
            owner.address?.toLowerCase().includes(term)
        );
    });

    if (loading) {
        return <p>Carregando donos...</p>;
    }

    return (
        <div className="container">
            <h1>Donos</h1>

            {message && (
                <div className="message">
                    {message}
                    <button onClick={() => setMessage('')}>x</button>
                </div>
            )}

            <div className="card">
                <h2>{editingOwner ? 'Editar dono' : 'Novo dono'}</h2>

                <form onSubmit={handleSubmit} className="form">
                    <input name="name" placeholder="Nome" value={form.name} onChange={handleChange} />
                    <input name="document" placeholder="Documento" value={form.document} onChange={handleChange} />
                    <input name="phone" placeholder="Telefone" value={form.phone} onChange={handleChange} />
                    <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
                    <textarea name="address" placeholder="Endereço" value={form.address} onChange={handleChange} />

                    <div className="actions">
                        <button type="submit">
                            {editingOwner ? 'Salvar alterações' : 'Cadastrar dono'}
                        </button>

                        {editingOwner && (
                            <button type="button" onClick={clearForm}>
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div className="card">
                <h2>Lista de donos</h2>

                <p>Total: {owners.length}</p>

                <input
                    className="search"
                    placeholder="Buscar..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <div className="table">
                    {filteredOwners.map((owner) => (
                        <div className="row" key={owner.id}>
                            <div>{owner.name}</div>
                            <div>{owner.document}</div>
                            <div>{owner.phone}</div>
                            <div>{owner.email}</div>

                            <div className="buttons">
                                <button onClick={() => handleDetails(owner)}>Ver</button>
                                <button onClick={() => handleEdit(owner)}>Editar</button>
                                <button onClick={() => handleDelete(owner)}>Excluir</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {detailOwner && (
                <div className="modal">
                    <div className="modalContent">
                        <h2>Detalhes do dono</h2>

                        <p><b>Nome:</b> {detailOwner.name}</p>
                        <p><b>Documento:</b> {detailOwner.document}</p>
                        <p><b>Telefone:</b> {detailOwner.phone}</p>
                        <p><b>Email:</b> {detailOwner.email}</p>
                        <p><b>Endereço:</b> {detailOwner.address}</p>

                        <h3>Pets vinculados</h3>

                        {detailOwner.pets?.length > 0 ? (
                            <ul>
                                {detailOwner.pets.map((pet) => (
                                    <li key={pet.id}>{pet.name}</li>
                                ))}
                            </ul>
                        ) : (
                            <p>Nenhum pet vinculado.</p>
                        )}

                        <button onClick={() => setDetailOwner(null)}>
                            Fechar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}