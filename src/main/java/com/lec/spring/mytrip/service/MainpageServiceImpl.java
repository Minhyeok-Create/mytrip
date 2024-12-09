package com.lec.spring.mytrip.service;

import com.lec.spring.mytrip.domain.City;
import com.lec.spring.mytrip.repository.MainRepository;
import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class MainpageServiceImpl implements MainpageService {

    private final MainRepository mainRepository;

    @Autowired
    public MainpageServiceImpl(SqlSession sqlSession) {
        mainRepository = sqlSession.getMapper(MainRepository.class);
    }

    @Override
    public List<City> getMostRecommendedCities() {
        return mainRepository.findMostRecommendedCities();
    }
}
