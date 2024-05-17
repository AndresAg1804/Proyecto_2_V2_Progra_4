package com.example.proyecto_2_v2.presentation;

import jakarta.persistence.Persistence;

public class LazyFieldsFilter {
    @Override
    public boolean equals(Object obj) {
        return obj==null || !Persistence.getPersistenceUtil().isLoaded(obj);
    }
}
