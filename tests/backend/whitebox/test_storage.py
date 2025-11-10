"""
Tests de Caja Blanca para el Storage
Prueban la lógica interna del sistema de almacenamiento
"""
import pytest
from datetime import datetime, timedelta, date
from app.storage import WeightEntryData, UserData
from app.config import USER_ID
from tests.backend.conftest import app, sample_user


class TestStorageGetAllWeightEntries:
    """Tests de caja blanca para el método get_all_weight_entries() del storage"""
    
    def test_get_all_weight_entries_with_weights(self, app, sample_user):
        """Test obtener todas las entradas cuando hay pesos"""
        with app.app_context():
            storage = app.storage
            base_date = datetime.now()
            
            # Añadir varios pesos
            weights = [
                WeightEntryData(entry_id=0, user_id=USER_ID, weight_kg=70.0, 
                              recorded_date=base_date - timedelta(days=10)),
                WeightEntryData(entry_id=0, user_id=USER_ID, weight_kg=72.5, 
                              recorded_date=base_date - timedelta(days=5)),
                WeightEntryData(entry_id=0, user_id=USER_ID, weight_kg=75.0, 
                              recorded_date=base_date),
            ]
            
            for weight in weights:
                storage.add_weight_entry(weight)
            
            # Obtener todas las entradas
            all_entries = storage.get_all_weight_entries(USER_ID)
            
            # Verificar que se obtienen todas
            assert len(all_entries) == 3
            
            # Verificar que están ordenadas por fecha descendente
            for i in range(len(all_entries) - 1):
                assert all_entries[i].recorded_date >= all_entries[i + 1].recorded_date
    
    def test_get_all_weight_entries_empty(self, app, sample_user):
        """Test obtener todas las entradas cuando no hay pesos"""
        with app.app_context():
            storage = app.storage
            all_entries = storage.get_all_weight_entries(USER_ID)
            
            assert isinstance(all_entries, list)
            assert len(all_entries) == 0
    
    def test_get_all_weight_entries_different_user(self, app, sample_user):
        """Test que solo se obtienen entradas del usuario correcto"""
        with app.app_context():
            storage = app.storage
            
            # Crear otro usuario
            other_user = UserData(
                user_id=2,
                first_name="Otro",
                last_name="Usuario",
                birth_date=date(1995, 1, 1),
                height_m=1.80
            )
            storage.save_user(other_user)
            
            # Añadir pesos para ambos usuarios
            weight_user1 = WeightEntryData(
                entry_id=0, user_id=USER_ID, weight_kg=70.0, 
                recorded_date=datetime.now()
            )
            weight_user2 = WeightEntryData(
                entry_id=0, user_id=2, weight_kg=80.0, 
                recorded_date=datetime.now()
            )
            
            storage.add_weight_entry(weight_user1)
            storage.add_weight_entry(weight_user2)
            
            # Obtener entradas solo del usuario 1
            entries_user1 = storage.get_all_weight_entries(USER_ID)
            
            # Verificar que solo se obtienen las del usuario 1
            assert len(entries_user1) == 1
            assert entries_user1[0].user_id == USER_ID
            assert entries_user1[0].weight_kg == 70.0
    
    def test_get_all_weight_entries_ordering(self, app, sample_user):
        """Test que las entradas están ordenadas por fecha descendente"""
        with app.app_context():
            storage = app.storage
            base_date = datetime.now()
            
            # Añadir pesos en orden no cronológico
            weights = [
                WeightEntryData(entry_id=0, user_id=USER_ID, weight_kg=70.0, 
                              recorded_date=base_date - timedelta(days=20)),
                WeightEntryData(entry_id=0, user_id=USER_ID, weight_kg=75.0, 
                              recorded_date=base_date),
                WeightEntryData(entry_id=0, user_id=USER_ID, weight_kg=72.5, 
                              recorded_date=base_date - timedelta(days=10)),
            ]
            
            for weight in weights:
                storage.add_weight_entry(weight)
            
            # Obtener todas las entradas
            all_entries = storage.get_all_weight_entries(USER_ID)
            
            # Verificar orden descendente (más reciente primero)
            assert len(all_entries) == 3
            assert all_entries[0].weight_kg == 75.0  # Más reciente
            assert all_entries[1].weight_kg == 72.5  # Intermedio
            assert all_entries[2].weight_kg == 70.0  # Más antiguo
    
    def test_get_all_weight_entries_same_day_replacement(self, app, sample_user):
        """Test que al reemplazar peso del mismo día, solo queda uno"""
        with app.app_context():
            storage = app.storage
            base_date = datetime.now()
            
            # Añadir peso
            weight1 = WeightEntryData(
                entry_id=0, user_id=USER_ID, weight_kg=70.0, 
                recorded_date=base_date
            )
            storage.add_weight_entry(weight1)
            
            # Añadir otro peso del mismo día (debe reemplazar)
            weight2 = WeightEntryData(
                entry_id=0, user_id=USER_ID, weight_kg=71.0, 
                recorded_date=base_date
            )
            storage.add_weight_entry(weight2)
            
            # Obtener todas las entradas
            all_entries = storage.get_all_weight_entries(USER_ID)
            
            # Debe haber solo una entrada (la segunda reemplazó a la primera)
            assert len(all_entries) == 1
            assert all_entries[0].weight_kg == 71.0

