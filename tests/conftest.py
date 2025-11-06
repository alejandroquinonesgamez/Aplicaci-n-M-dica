import os
import shutil
import tempfile
from pathlib import Path

import pytest

from app import create_app
from app.database import db


@pytest.fixture(scope="function")
def app():
    temp_instance_dir = tempfile.mkdtemp(prefix="flask_instance_")

    os.environ["FLASK_ENV"] = "testing"

    db_path = Path(temp_instance_dir) / "test_app.db"

    test_config = {
        "SQLALCHEMY_DATABASE_URI": f"sqlite:///{db_path}",
        "TESTING": True,
    }

    app = create_app(test_config=test_config)

    app.instance_path = temp_instance_dir

    with app.app_context():
        db.drop_all()
        db.create_all()

    yield app

    shutil.rmtree(temp_instance_dir, ignore_errors=True)


@pytest.fixture()
def client(app):
    return app.test_client()