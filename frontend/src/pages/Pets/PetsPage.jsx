import { useEffect, useState } from 'react';
import { petsService, ownersService } from '../../services/resourcesService';
import './pets.css';

const emptyForm = {
    name: '',
    species: '',
    breed: '',
    size: 'small',
    age: '',
    weight: '',
    notes: '',
    ownerId: '',
};

export default function PetsPage() {
    const [pets, setPets] = useState([]);
    const [owners, setOwners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [form, setForm] = useState(emptyForm);
    const [editingPet, setEditingPet] = useState(null);
    const [detailPet, setDetailPet] = useState(null);
    const [message, setMessage] = useState('');

    async function loadData() {
        try {
            setLoading(true);

            const petsData = await petsService.list();
            const ownersData = await ownersService.list();

            setPets(petsData);
            setOwners(ownersData);
        } catch (error) {
            setMessage('Erro ao carregar os dados.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadData();
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
        setEditingPet(null);
    }

    function getSizeText(size) {
        if (size === 'small') return 'Pequeno';
        if (size === 'medium') return 'Médio';
        if (size === 'large') return 'Grande';
        return size;
    }

    function formatDate(date) {
        if (!date) return '-';
        return new Date(date).toLocaleString('pt-BR');
    }

    function formatMoney(value) {
        if (!value) return 'R$ 0,00';
        return Number(value).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        });
    }

    function getStatusText(status) {
        if (status === 'scheduled') return 'Agendado';
        if (status === 'in_progress') return 'Em andamento';
        if (status === 'completed') return 'Concluído';
        if (status === 'canceled') return 'Cancelado';
        return status;
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (
            !form.name ||
            !form.species ||
            !form.breed ||
            !form.ownerId ||
            !form.age ||
            !form.weight
        ) {
            setMessage('Preencha os campos obrigatórios.');
            return;
        }

        // No puede menor a zero

        if (Number(form.weight) <= 0) {
            setMessage('O peso deve ser maior que zero.');
            return;
        }

        if (Number(form.age) <= 0) {
            setMessage('O ano deve ser maior a zero.');
            return;
        }

        const payload = {
            name: form.name,
            species: form.species,
            breed: form.breed,
            size: form.size,
            age: Number(form.age),
            weight: Number(form.weight),
            notes: form.notes,
            ownerId: Number(form.ownerId),
        };

        try {
            if (editingPet) {
                await petsService.update(editingPet.id, payload);
                setMessage('Pet atualizado com sucesso.');
            } else {
                await petsService.create(payload);
                setMessage('Pet cadastrado com sucesso.');
            }

            clearForm();
            loadData();
        } catch (error) {
            setMessage('Erro ao salvar pet.');
        }
    }

    function handleEdit(pet) {
        setEditingPet(pet);

        setForm({
            name: pet.name || '',
            species: pet.species || '',
            breed: pet.breed || '',
            size: pet.size || 'small',
            age: String(pet.age || ''),
            weight: String(pet.weight || ''),
            notes: pet.notes || '',
            ownerId: String(pet.ownerId || ''),
        });
    }

    async function handleDetails(pet) {
        try {
            const data = await petsService.getById(pet.id);
            setDetailPet(data);
        } catch (error) {
            setMessage('Erro ao carregar detalhes do pet.');
        }
    }

    async function handleDelete(pet) {
        const confirmDelete = window.confirm(`Deseja excluir ${pet.name}?`);

        if (!confirmDelete) return;

        try {
            await petsService.remove(pet.id);
            setMessage('Pet excluído com sucesso.');
            loadData();
        } catch (error) {
            setMessage('Erro ao excluir pet.');
        }
    }

    // Filtrar 


    const filteredPets = pets.filter((pet) => {
        const term = search.toLowerCase();

        return (
            pet.name?.toLowerCase().includes(term) ||
            pet.species?.toLowerCase().includes(term) ||
            pet.breed?.toLowerCase().includes(term) ||
            pet.owner?.name?.toLowerCase().includes(term) ||
            pet.notes?.toLowerCase().includes(term)  
         
        );
    });

    if (loading) return <p className="text">Carregando pets...</p>;

    return (
        <div className="page">
            <h1>Pets</h1>

            <p>Cadastre e acompanhe os animais atendidos pelo petshop.</p>

            {message && <p className="message">{message}</p>}

            <h2>{editingPet ? 'Editar pet' : 'Novo pet'}</h2>

            <form className="card" onSubmit={handleSubmit}>
                <input name="name" placeholder="Nome" value={form.name} onChange={handleChange} />
                <input name="species" placeholder="Espécie" value={form.species} onChange={handleChange} />
                <input name="breed" placeholder="Raça" value={form.breed} onChange={handleChange} />

                <select name="size" value={form.size} onChange={handleChange}>
                    <option value="small">Pequeno</option>
                    <option value="medium">Médio</option>
                    <option value="large">Grande</option>
                </select>

                <input type="number" name="age" placeholder="Idade" value={form.age} onChange={handleChange} />
                <input type="number" name="weight" placeholder="Peso" value={form.weight} onChange={handleChange} />

                <select name="ownerId" value={form.ownerId} onChange={handleChange}>
                    <option value="">Selecione dono</option>
                    {owners.map((owner) => (
                        <option key={owner.id} value={owner.id}>
                            {owner.name}
                        </option>
                    ))}
                </select>

                <textarea name="notes" placeholder="Observações" value={form.notes} onChange={handleChange} />

                <button type="submit">
                    {editingPet ? 'Salvar' : 'Cadastrar'}
                </button>

                {editingPet && (
                    <button type="button" onClick={clearForm}>
                        Cancelar
                    </button>
                )}
            </form>

            <input
                className="search"
                placeholder="Buscar pets..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Espécie</th>
                        <th>Raça</th>
                        <th>Idade</th>
                        <th>Peso</th>
                        <th>Porte</th>
                        <th>Dono</th>
                        <th>Observações</th>
                        <th>Ações</th>
                    </tr>
                </thead>

                <tbody>
                    {filteredPets.map((pet) => (
                        <tr key={pet.id}>
                            <td>{pet.name}</td>
                            <td>{pet.species}</td>
                            <td>{pet.breed}</td>
                            <td>{pet.age}</td>
                            <td>{pet.weight}</td>
                            <td>{getSizeText(pet.size)}</td>
                            <td>{pet.owner?.name || '-'}</td>
                            <td>{pet.notes}</td>
                            <td>
                                <button onClick={() => handleDetails(pet)}>Ver</button>
                                <button onClick={() => handleEdit(pet)}>Editar</button>
                                <button onClick={() => handleDelete(pet)}>Excluir</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {detailPet && (
                <div className="modal">
                    <div className="modalContent">
                        <h2>Detalhes</h2>

                        <p>{detailPet.name}</p>
                        <p>{detailPet.owner?.name}</p>
                        <p>{detailPet.species}</p>
                        <p>{detailPet.breed}</p>
                        <p>{detailPet.weight} kg</p>
                        <p>{getSizeText(detailPet.size)}</p>
                        <p>{detailPet.notes}</p>
                     

                        <button onClick={() => setDetailPet(null)}>
                            Fechar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}