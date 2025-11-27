"use client";
import React from "react";

import { Accordion, ListGroup, Checkbox, Label } from "flowbite-react";

const SideBar = () => {
  return (
    <Accordion className="bg-white">
      <Accordion.Panel>
        <Accordion.Title>Байгууллага</Accordion.Title>
        <Accordion.Content>
          <ListGroup>
            <ListGroup.Item>Үндэсний Статистикийн хороо</ListGroup.Item>
            <ListGroup.Item>Улсын бүртгэлийн ерөнхий газар</ListGroup.Item>
            <ListGroup.Item>Санхүүгийн зохицуулах хороо</ListGroup.Item>
          </ListGroup>
        </Accordion.Content>
      </Accordion.Panel>
      <Accordion.Panel>
        <Accordion.Title>Салбар</Accordion.Title>
        <Accordion.Content>
          <ListGroup>
            <ListGroup.Item>Аж үйлдвэр</ListGroup.Item>
            <ListGroup.Item>Аялал жуулчлал</ListGroup.Item>
            <ListGroup.Item> Биеийн тамир, спорт</ListGroup.Item>
            <ListGroup.Item>Бизнес регистр</ListGroup.Item>
            <ListGroup.Item>Барилга</ListGroup.Item>
            <ListGroup.Item>Боловсрол</ListGroup.Item>
          </ListGroup>
        </Accordion.Content>
      </Accordion.Panel>
      <Accordion.Panel>
        <Accordion.Title>Анхдагч үүсвэр</Accordion.Title>
        <Accordion.Content>
          <ListGroup>
            <ListGroup.Item>Анхдагч үүсвэр</ListGroup.Item>
            <ListGroup.Item>Анхдагч үүсвэр</ListGroup.Item>
            <ListGroup.Item>Анхдагч үүсвэр</ListGroup.Item>
            <ListGroup.Item>Анхдагч үүсвэр</ListGroup.Item>
            <ListGroup.Item>Анхдагч үүсвэр</ListGroup.Item>
            <ListGroup.Item>Анхдагч үүсвэр</ListGroup.Item>
          </ListGroup>
        </Accordion.Content>
      </Accordion.Panel>
      <Accordion.Panel>
        <Accordion.Title>Давтамж</Accordion.Title>
        <Accordion.Content>
          <div className="flex max-w-md flex-col gap-4" id="checkbox">
            <div className="flex items-center gap-2">
              <Checkbox id="accept" defaultChecked />
              <Label htmlFor="accept" className="flex">
                Сар
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="promotion" />
              <Label htmlFor="promotion">Улирал</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="age" />
              <Label htmlFor="age">Хагас жил</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="year" />
              <Label htmlFor="year">Жил</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="everytime" />
              <Label htmlFor="everytime">Тухай бүр</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="noneed" />
              <Label htmlFor="noneed">Дахин цуглуулах шаардлагагүй</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="other" />
              <Label htmlFor="other">Бусад</Label>
            </div>
          </div>
        </Accordion.Content>
      </Accordion.Panel>
    </Accordion>
  );
};

export default SideBar;
